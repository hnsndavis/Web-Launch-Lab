#!/usr/bin/env python3
"""
Free CLI-Based CRM System for WebLaunch Lab
Zero monthly costs, full automation, command-line interface
"""

import json
import csv
import os
import sqlite3
from datetime import datetime, timedelta
import subprocess
import sys

class WebLaunchCRM:
    def __init__(self, db_path="weblaunch_crm.db"):
        """Initialize the CRM system"""
        self.db_path = db_path
        self.init_database()
        
    def init_database(self):
        """Create database tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Leads table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                business_name TEXT NOT NULL,
                contact_name TEXT,
                email TEXT,
                phone TEXT,
                industry TEXT,
                address TEXT,
                website TEXT,
                lead_score INTEGER,
                status TEXT DEFAULT 'new',
                source TEXT,
                created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_contact TIMESTAMP,
                notes TEXT,
                assigned_to TEXT
            )
        ''')
        
        # Email interactions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS email_interactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lead_id INTEGER,
                email_type TEXT,
                subject TEXT,
                sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                opened BOOLEAN DEFAULT FALSE,
                replied BOOLEAN DEFAULT FALSE,
                clicked BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (lead_id) REFERENCES leads (id)
            )
        ''')
        
        # Tasks table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lead_id INTEGER,
                task_type TEXT,
                description TEXT,
                due_date TIMESTAMP,
                completed BOOLEAN DEFAULT FALSE,
                created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (lead_id) REFERENCES leads (id)
            )
        ''')
        
        # Pipeline stages table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS pipeline_stages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                stage_name TEXT NOT NULL,
                stage_order INTEGER,
                automation_trigger TEXT
            )
        ''')
        
        # Initialize default pipeline stages
        cursor.execute('SELECT COUNT(*) FROM pipeline_stages')
        if cursor.fetchone()[0] == 0:
            stages = [
                ('New Lead', 1, 'send_initial_email'),
                ('Contacted', 2, 'schedule_follow_up'),
                ('Qualified', 3, 'send_proposal'),
                ('Proposal Sent', 4, 'schedule_follow_up_call'),
                ('Won', 5, 'create_project'),
                ('Lost', 6, 'add_to_nurture_sequence')
            ]
            cursor.executemany('INSERT INTO pipeline_stages (stage_name, stage_order, automation_trigger) VALUES (?, ?, ?)', stages)
        
        conn.commit()
        conn.close()
    
    def import_leads_from_csv(self, csv_file):
        """Import leads from generated CSV"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        imported = 0
        with open(csv_file, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Check if lead already exists
                cursor.execute('SELECT id FROM leads WHERE email = ?', (row['contact_email'],))
                if cursor.fetchone():
                    continue
                
                cursor.execute('''
                    INSERT INTO leads (
                        business_name, contact_name, email, phone, industry,
                        address, website, lead_score, source
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    row['business_name'],
                    row['contact_name'],
                    row['contact_email'],
                    row['phone'],
                    row['industry'],
                    row['address'],
                    row['website'],
                    int(row['lead_score']),
                    'automated_scraper'
                ))
                imported += 1
        
        conn.commit()
        conn.close()
        print(f"✅ Imported {imported} new leads")
        return imported
    
    def get_leads(self, status=None, limit=None):
        """Get leads with optional filtering"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        query = 'SELECT * FROM leads'
        params = []
        
        if status:
            query += ' WHERE status = ?'
            params.append(status)
        
        query += ' ORDER BY lead_score DESC, created_date DESC'
        
        if limit:
            query += ' LIMIT ?'
            params.append(limit)
        
        cursor.execute(query, params)
        leads = cursor.fetchall()
        conn.close()
        
        # Convert to dict format
        columns = ['id', 'business_name', 'contact_name', 'email', 'phone', 'industry', 
                  'address', 'website', 'lead_score', 'status', 'source', 'created_date', 
                  'last_contact', 'notes', 'assigned_to']
        
        return [dict(zip(columns, lead)) for lead in leads]
    
    def update_lead_status(self, lead_id, new_status, notes=""):
        """Update lead status and add notes"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE leads 
            SET status = ?, last_contact = CURRENT_TIMESTAMP, notes = ?
            WHERE id = ?
        ''', (new_status, notes, lead_id))
        
        conn.commit()
        conn.close()
        print(f"✅ Updated lead {lead_id} to {new_status}")
    
    def log_email_sent(self, lead_id, email_type, subject):
        """Log email interaction"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO email_interactions (lead_id, email_type, subject)
            VALUES (?, ?, ?)
        ''', (lead_id, email_type, subject))
        
        conn.commit()
        conn.close()
    
    def create_task(self, lead_id, task_type, description, due_days=3):
        """Create follow-up task"""
        due_date = datetime.now() + timedelta(days=due_days)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO tasks (lead_id, task_type, description, due_date)
            VALUES (?, ?, ?, ?)
        ''', (lead_id, task_type, description, due_date))
        
        conn.commit()
        conn.close()
        print(f"✅ Created {task_type} task for lead {lead_id}")
    
    def get_today_tasks(self):
        """Get tasks due today"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT t.*, l.business_name, l.contact_name, l.email
            FROM tasks t
            JOIN leads l ON t.lead_id = l.id
            WHERE DATE(t.due_date) <= DATE('now')
            AND t.completed = FALSE
            ORDER BY t.due_date ASC
        ''')
        
        tasks = cursor.fetchall()
        conn.close()
        return tasks
    
    def dashboard(self):
        """Show CRM dashboard"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Lead statistics
        cursor.execute('SELECT status, COUNT(*) FROM leads GROUP BY status')
        status_counts = dict(cursor.fetchall())
        
        cursor.execute('SELECT COUNT(*) FROM leads')
        total_leads = cursor.fetchone()[0]
        
        cursor.execute('SELECT AVG(lead_score) FROM leads')
        avg_score = cursor.fetchone()[0] or 0
        
        # Recent activity
        cursor.execute('SELECT COUNT(*) FROM email_interactions WHERE DATE(sent_date) = DATE("now")')
        today_emails = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM tasks WHERE completed = FALSE AND DATE(due_date) <= DATE("now")')
        overdue_tasks = cursor.fetchone()[0]
        
        conn.close()
        
        print("\n🚀 WebLaunch Lab CRM Dashboard")
        print("=" * 40)
        print(f"Total Leads: {total_leads}")
        print(f"Average Score: {avg_score:.1f}/100")
        print(f"Emails Sent Today: {today_emails}")
        print(f"Tasks Due: {overdue_tasks}")
        print("\nLead Status Breakdown:")
        for status, count in status_counts.items():
            print(f"  {status.title()}: {count}")
    
    def export_for_email_campaign(self, status="new", min_score=70):
        """Export high-scoring leads for email campaign"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT business_name, contact_name, email, industry, lead_score
            FROM leads
            WHERE status = ? AND lead_score >= ?
            ORDER BY lead_score DESC
        ''', (status, min_score))
        
        leads = cursor.fetchall()
        conn.close()
        
        # Export to CSV for email system
        filename = f"campaign_export_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
        with open(filename, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['business_name', 'contact_name', 'email', 'industry', 'lead_score'])
            writer.writerows(leads)
        
        print(f"✅ Exported {len(leads)} leads to {filename}")
        return filename

def main():
    """CLI Interface"""
    crm = WebLaunchCRM()
    
    if len(sys.argv) < 2:
        print("🚀 WebLaunch Lab CLI CRM")
        print("\nCommands:")
        print("  dashboard                    - Show CRM overview")
        print("  import <csv_file>           - Import leads from CSV")
        print("  leads [status] [limit]      - List leads")
        print("  update <lead_id> <status>   - Update lead status")
        print("  tasks                       - Show today's tasks")
        print("  export [min_score]          - Export leads for email campaign")
        print("  complete-task <task_id>     - Mark task as complete")
        return
    
    command = sys.argv[1]
    
    if command == "dashboard":
        crm.dashboard()
        
    elif command == "import" and len(sys.argv) > 2:
        csv_file = sys.argv[2]
        if os.path.exists(csv_file):
            crm.import_leads_from_csv(csv_file)
        else:
            print(f"❌ File not found: {csv_file}")
    
    elif command == "leads":
        status = sys.argv[2] if len(sys.argv) > 2 else None
        limit = int(sys.argv[3]) if len(sys.argv) > 3 else 10
        
        leads = crm.get_leads(status, limit)
        print(f"\n📋 Leads ({len(leads)} shown)")
        print("-" * 80)
        for lead in leads:
            print(f"ID: {lead['id']} | {lead['business_name']} | {lead['email']} | Score: {lead['lead_score']}/100 | Status: {lead['status']}")
    
    elif command == "update" and len(sys.argv) > 3:
        lead_id = int(sys.argv[2])
        new_status = sys.argv[3]
        notes = " ".join(sys.argv[4:]) if len(sys.argv) > 4 else ""
        crm.update_lead_status(lead_id, new_status, notes)
    
    elif command == "tasks":
        tasks = crm.get_today_tasks()
        print(f"\n📅 Today's Tasks ({len(tasks)})")
        print("-" * 60)
        for task in tasks:
            print(f"ID: {task[0]} | {task[7]} ({task[8]}) | {task[3]} | Due: {task[4]}")
    
    elif command == "export":
        min_score = int(sys.argv[2]) if len(sys.argv) > 2 else 70
        filename = crm.export_for_email_campaign(min_score=min_score)
        print(f"Ready for email campaign: {filename}")
    
    else:
        print("❌ Unknown command. Run without arguments for help.")

if __name__ == "__main__":
    main()