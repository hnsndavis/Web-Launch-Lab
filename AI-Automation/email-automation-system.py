#!/usr/bin/env python3
"""
WebLaunch Lab Email Automation System
Automates sending of personalized campaigns with tracking and follow-ups
"""

import smtplib
import time
import csv
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import json

class EmailAutomationSystem:
    def __init__(self, config_file="email_config.json"):
        """Initialize email automation system"""
        self.config = self.load_config(config_file)
        self.sent_log = "sent_emails.json"
        self.campaign_data = {}
        
    def load_config(self, config_file):
        """Load email configuration"""
        default_config = {
            "smtp_server": "smtp.gmail.com",
            "smtp_port": 587,
            "sender_email": "your-email@gmail.com",
            "sender_password": "your-app-password",
            "sender_name": "Keegan Hansen-Davis",
            "company_name": "WebLaunch Lab",
            "daily_send_limit": 50,
            "send_delay_minutes": 5,
            "follow_up_days": [3, 7, 14]
        }
        
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                user_config = json.load(f)
                default_config.update(user_config)
        else:
            # Create default config file
            with open(config_file, 'w') as f:
                json.dump(default_config, f, indent=2)
            print(f"📧 Created {config_file} - Please update with your email credentials")
            
        return default_config
    
    def load_campaign_emails(self, campaign_folder):
        """Load all campaign emails from folder"""
        emails = []
        for filename in sorted(os.listdir(campaign_folder)):
            if filename.endswith('.txt'):
                filepath = os.path.join(campaign_folder, filename)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                # Parse email content
                lines = content.split('\n')
                email_data = {
                    'filename': filename,
                    'to_email': lines[0].replace('TO: ', ''),
                    'business_name': lines[1].replace('BUSINESS: ', ''),
                    'score': lines[2].replace('SCORE: ', ''),
                    'industry': lines[3].replace('INDUSTRY: ', ''),
                    'subject': '',
                    'body': ''
                }
                
                # Extract subject and body
                subject_line = None
                body_start = None
                for i, line in enumerate(lines):
                    if line.startswith('Subject: '):
                        email_data['subject'] = line.replace('Subject: ', '')
                        subject_line = i
                    elif subject_line and line.strip() == '' and not body_start:
                        body_start = i + 1
                        break
                
                if body_start:
                    email_data['body'] = '\n'.join(lines[body_start:]).strip()
                
                emails.append(email_data)
        
        return emails
    
    def send_email_campaign(self, campaign_folder, test_mode=True):
        """Send email campaign with automation"""
        emails = self.load_campaign_emails(campaign_folder)
        sent_count = 0
        
        print(f"📧 Loading campaign from: {campaign_folder}")
        print(f"📊 Found {len(emails)} emails to send")
        
        if test_mode:
            print("🧪 TEST MODE: Emails will be logged but not sent")
        else:
            print("🚀 LIVE MODE: Emails will be sent")
        
        # Load sent email log
        sent_log = self.load_sent_log()
        
        for email in emails:
            # Check if already sent
            email_id = f"{email['to_email']}_{email['business_name']}"
            if email_id in sent_log:
                print(f"⏭️  Skipping {email['business_name']} - Already sent")
                continue
            
            # Send email
            if test_mode:
                print(f"📧 [TEST] Would send to {email['business_name']} ({email['to_email']})")
            else:
                success = self.send_single_email(email)
                if success:
                    # Log successful send
                    sent_log[email_id] = {
                        'sent_date': datetime.now().isoformat(),
                        'business_name': email['business_name'],
                        'email': email['to_email'],
                        'score': email['score'],
                        'subject': email['subject']
                    }
                    sent_count += 1
                    print(f"✅ Sent to {email['business_name']} ({sent_count}/{len(emails)})")
                else:
                    print(f"❌ Failed to send to {email['business_name']}")
            
            # Rate limiting
            if not test_mode:
                time.sleep(self.config['send_delay_minutes'] * 60)
            
            # Daily limit check
            if sent_count >= self.config['daily_send_limit']:
                print(f"📊 Daily limit reached ({self.config['daily_send_limit']})")
                break
        
        # Save sent log
        self.save_sent_log(sent_log)
        
        print(f"\n📊 Campaign Summary:")
        print(f"   Emails sent: {sent_count}")
        print(f"   Total emails: {len(emails)}")
        print(f"   Success rate: {(sent_count/len(emails)*100):.1f}%")
        
        return sent_count
    
    def send_single_email(self, email_data):
        """Send a single email"""
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = f"{self.config['sender_name']} <{self.config['sender_email']}>"
            msg['To'] = email_data['to_email']
            msg['Subject'] = email_data['subject']
            
            # Add body
            msg.attach(MIMEText(email_data['body'], 'plain'))
            
            # Send email
            server = smtplib.SMTP(self.config['smtp_server'], self.config['smtp_port'])
            server.starttls()
            server.login(self.config['sender_email'], self.config['sender_password'])
            
            text = msg.as_string()
            server.sendmail(self.config['sender_email'], email_data['to_email'], text)
            server.quit()
            
            return True
            
        except Exception as e:
            print(f"❌ Error sending email: {str(e)}")
            return False
    
    def load_sent_log(self):
        """Load sent email log"""
        if os.path.exists(self.sent_log):
            with open(self.sent_log, 'r') as f:
                return json.load(f)
        return {}
    
    def save_sent_log(self, log_data):
        """Save sent email log"""
        with open(self.sent_log, 'w') as f:
            json.dump(log_data, f, indent=2)
    
    def schedule_follow_ups(self):
        """Schedule follow-up emails for prospects who didn't respond"""
        sent_log = self.load_sent_log()
        follow_ups_needed = []
        
        for email_id, data in sent_log.items():
            sent_date = datetime.fromisoformat(data['sent_date'])
            days_since = (datetime.now() - sent_date).days
            
            # Check if follow-up is needed
            for follow_up_day in self.config['follow_up_days']:
                if days_since >= follow_up_day:
                    follow_up_key = f"{email_id}_followup_{follow_up_day}"
                    if follow_up_key not in sent_log:
                        follow_ups_needed.append({
                            'original_data': data,
                            'follow_up_day': follow_up_day,
                            'days_since': days_since
                        })
        
        if follow_ups_needed:
            print(f"📅 {len(follow_ups_needed)} follow-ups needed")
            return follow_ups_needed
        else:
            print("✅ No follow-ups needed at this time")
            return []
    
    def generate_campaign_report(self):
        """Generate campaign performance report"""
        sent_log = self.load_sent_log()
        
        if not sent_log:
            print("📊 No campaign data available")
            return
        
        report = {
            'total_sent': len(sent_log),
            'industries': {},
            'average_score': 0,
            'recent_sends': []
        }
        
        scores = []
        for data in sent_log.values():
            # Count by industry (extract from business name patterns)
            business_name = data['business_name'].lower()
            if 'dental' in business_name or 'oral' in business_name:
                industry = 'Dental'
            elif 'law' in business_name or 'legal' in business_name:
                industry = 'Legal'
            elif 'hvac' in business_name or 'heating' in business_name or 'cooling' in business_name:
                industry = 'HVAC'
            else:
                industry = 'Other'
            
            report['industries'][industry] = report['industries'].get(industry, 0) + 1
            
            # Collect scores
            try:
                score = int(data['score'].split('/')[0])
                scores.append(score)
            except:
                pass
        
        if scores:
            report['average_score'] = sum(scores) / len(scores)
        
        # Recent sends (last 7 days)
        recent_cutoff = datetime.now() - timedelta(days=7)
        for data in sent_log.values():
            sent_date = datetime.fromisoformat(data['sent_date'])
            if sent_date >= recent_cutoff:
                report['recent_sends'].append(data)
        
        # Print report
        print("\n📊 Campaign Performance Report")
        print("=" * 40)
        print(f"Total emails sent: {report['total_sent']}")
        print(f"Average lead score: {report['average_score']:.1f}/100")
        print(f"Recent sends (7 days): {len(report['recent_sends'])}")
        print("\nBy Industry:")
        for industry, count in report['industries'].items():
            print(f"  {industry}: {count} emails")
        
        return report

def main():
    """Main automation interface"""
    system = EmailAutomationSystem()
    
    # Find latest campaign folder
    emails_dir = "emails"
    if os.path.exists(emails_dir):
        campaigns = [d for d in os.listdir(emails_dir) if os.path.isdir(os.path.join(emails_dir, d))]
        if campaigns:
            latest_campaign = sorted(campaigns)[-1]
            campaign_path = os.path.join(emails_dir, latest_campaign)
            
            print("🚀 WebLaunch Lab Email Automation System")
            print("=" * 50)
            print(f"Latest campaign: {latest_campaign}")
            
            # Menu
            while True:
                print("\nOptions:")
                print("1. Test send (preview mode)")
                print("2. Send campaign (live)")
                print("3. Check follow-ups needed")
                print("4. Campaign report")
                print("5. Exit")
                
                choice = input("\nSelect option (1-5): ").strip()
                
                if choice == '1':
                    system.send_email_campaign(campaign_path, test_mode=True)
                elif choice == '2':
                    confirm = input("⚠️  Send live emails? (yes/no): ").strip().lower()
                    if confirm == 'yes':
                        system.send_email_campaign(campaign_path, test_mode=False)
                elif choice == '3':
                    system.schedule_follow_ups()
                elif choice == '4':
                    system.generate_campaign_report()
                elif choice == '5':
                    break
                else:
                    print("Invalid option")
        else:
            print("❌ No email campaigns found in 'emails' directory")
    else:
        print("❌ 'emails' directory not found")

if __name__ == "__main__":
    main()