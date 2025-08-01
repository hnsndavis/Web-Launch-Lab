#!/usr/bin/env python3
"""
WebLaunch Lab: Local Lead Generation System
Alternative to Clay.com - runs locally with full control
"""

import requests
import json
import csv
import time
from datetime import datetime
from pathlib import Path
import os

class LocalLeadGenerator:
    def __init__(self):
        self.base_dir = Path("/Users/keeganhansen-davis/Command-Center/01-Business/WebLaunch-Lab/AI-Automation")
        self.leads_file = self.base_dir / "leads_database.csv"
        self.config_file = self.base_dir / "lead_config.json"
        self.setup_directories()
        
    def setup_directories(self):
        """Create necessary directories"""
        self.base_dir.mkdir(exist_ok=True)
        (self.base_dir / "exports").mkdir(exist_ok=True)
        (self.base_dir / "emails").mkdir(exist_ok=True)
        
    def search_local_businesses(self, location, industry, limit=100):
        """
        Find local businesses using Google Places API
        You'll need a Google Places API key (free tier available)
        """
        print(f"🔍 Searching for {industry} businesses in {location}...")
        
        # For now, we'll create sample data structure
        # You can integrate with Google Places API, Yelp API, or other sources
        businesses = []
        
        # Sample business structure - replace with actual API calls
        sample_businesses = [
            {
                "name": "ABC Dental Practice",
                "address": "123 Main St, Your City, State",
                "phone": "(555) 123-4567",
                "industry": "Healthcare",
                "website": "abcdental.com",
                "google_rating": 4.2,
                "review_count": 89
            },
            {
                "name": "Smith Law Firm", 
                "address": "456 Oak Ave, Your City, State",
                "phone": "(555) 234-5678",
                "industry": "Legal Services",
                "website": "smithlaw.com",
                "google_rating": 4.7,
                "review_count": 124
            }
        ]
        
        return sample_businesses[:limit]
    
    def enrich_business_data(self, business):
        """
        Enrich business data with additional information
        """
        enriched = business.copy()
        
        # Website analysis (you can integrate with actual tools)
        enriched['website_speed'] = self.check_website_speed(business.get('website'))
        enriched['mobile_friendly'] = self.check_mobile_friendly(business.get('website'))
        enriched['last_updated'] = self.estimate_website_age(business.get('website'))
        
        # Find decision makers (you can integrate with LinkedIn API)
        enriched['decision_makers'] = self.find_decision_makers(business)
        
        # Calculate lead score
        enriched['lead_score'] = self.calculate_lead_score(enriched)
        
        return enriched
    
    def check_website_speed(self, website):
        """
        Check website loading speed
        You can integrate with PageSpeed Insights API
        """
        if not website:
            return 0
        
        try:
            # Simulate website speed check
            # Replace with actual PageSpeed API call
            import random
            return round(random.uniform(1.5, 8.0), 1)
        except:
            return 0
    
    def check_mobile_friendly(self, website):
        """
        Check if website is mobile friendly
        """
        if not website:
            return False
        
        # Simulate mobile-friendly check
        # Replace with actual Google Mobile-Friendly Test API
        import random
        return random.choice([True, False])
    
    def estimate_website_age(self, website):
        """
        Estimate when website was last updated
        """
        if not website:
            return 999
        
        # Simulate website age estimation
        # Replace with actual domain/website analysis
        import random
        return random.randint(30, 1095)  # 30 days to 3 years
    
    def find_decision_makers(self, business):
        """
        Find decision makers for the business
        You can integrate with Apollo.io API or LinkedIn
        """
        # Sample decision makers - replace with actual API calls
        decision_makers = [
            {
                "name": f"John Smith",
                "title": "Owner",
                "email": f"john@{business.get('website', 'example.com')}",
                "linkedin": f"linkedin.com/in/johnsmith"
            }
        ]
        
        return decision_makers
    
    def calculate_lead_score(self, business):
        """
        Calculate lead score based on multiple factors
        """
        score = 0
        
        # No website or very slow website (+40 points)
        if not business.get('website') or business.get('website_speed', 0) > 5:
            score += 40
        
        # Website not mobile friendly (+30 points)  
        if not business.get('mobile_friendly', True):
            score += 30
            
        # Website older than 2 years (+25 points)
        if business.get('last_updated', 0) > 730:
            score += 25
            
        # Good Google rating (+15 points)
        if business.get('google_rating', 0) >= 4.0:
            score += 15
            
        # Many reviews (+10 points)
        if business.get('review_count', 0) >= 50:
            score += 10
            
        # Has decision maker contact (+20 points)
        if business.get('decision_makers'):
            score += 20
            
        return min(score, 100)  # Cap at 100
    
    def generate_email_content(self, business, template_type="audit"):
        """
        Generate personalized email content using AI
        """
        decision_maker = business.get('decision_makers', [{}])[0]
        name = decision_maker.get('name', 'there')
        first_name = name.split()[0] if name != 'there' else 'there'
        
        templates = {
            "audit": f"""Subject: Quick website question for {business['name']}

Hi {first_name},

I was researching {business.get('industry', 'local')} businesses in your area and came across {business['name']}.

Quick question: Are you happy with how many new customers find you online?

I noticed a few things about your current web presence that might be costing you customers:
• Website loads in {business.get('website_speed', 'unknown')} seconds (should be under 3)
• {"Not optimized for mobile searches" if not business.get('mobile_friendly') else "Mobile experience could be improved"}
• Last major update appears to be {business.get('last_updated', 365)} days ago

The good news? I just helped a similar {business.get('industry', 'local')} business increase their leads by 340% with a simple 7-day website refresh.

Worth a quick 15-minute conversation to show you exactly what's possible?

[Calendar Link - Book Here]

Best regards,
Keegan Hansen-Davis
WebLaunch Lab
P.S. - This consultation is completely free and takes just 15 minutes. Most businesses are shocked at what they discover.""",

            "competition": f"""Subject: {business['name']} vs your top competitor online

{first_name},

I was doing local SEO research and discovered something important about {business['name']}'s online presence...

While researching {business.get('industry', 'your industry')} in your area, I found that your main competitor is capturing customers that should be finding YOU.

Here's what I discovered:
• Your website speed: {business.get('website_speed', 'unknown')} seconds
• Competitor's speed: Under 2 seconds
• Your mobile experience: {"Needs improvement" if not business.get('mobile_friendly') else "Good"}
• Their mobile experience: Optimized for all devices

This means potential customers are choosing them simply because they found them first online.

Want to see exactly how to flip this situation in your favor?

I can show you the exact strategy that helped 3 other {business.get('industry', 'local')} businesses dominate their local market in just 7 days.

[Free Strategy Session - 15 Minutes]

Talk soon,
Keegan Hansen-Davis
WebLaunch Lab"""
        }
        
        return templates.get(template_type, templates["audit"])
    
    def export_leads(self, leads, filename=None):
        """
        Export leads to CSV for easy management
        """
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M")
            filename = f"leads_export_{timestamp}.csv"
        
        export_path = self.base_dir / "exports" / filename
        
        # Flatten the data for CSV export
        csv_data = []
        for lead in leads:
            decision_maker = lead.get('decision_makers', [{}])[0]
            csv_row = {
                'business_name': lead.get('name'),
                'industry': lead.get('industry'),
                'address': lead.get('address'),
                'phone': lead.get('phone'),
                'website': lead.get('website'),
                'google_rating': lead.get('google_rating'),
                'review_count': lead.get('review_count'),
                'website_speed': lead.get('website_speed'),
                'mobile_friendly': lead.get('mobile_friendly'),
                'last_updated_days': lead.get('last_updated'),
                'lead_score': lead.get('lead_score'),
                'decision_maker_name': decision_maker.get('name'),
                'decision_maker_title': decision_maker.get('title'),
                'decision_maker_email': decision_maker.get('email'),
                'decision_maker_linkedin': decision_maker.get('linkedin')
            }
            csv_data.append(csv_row)
        
        # Write to CSV
        with open(export_path, 'w', newline='', encoding='utf-8') as csvfile:
            if csv_data:
                fieldnames = csv_data[0].keys()
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(csv_data)
        
        print(f"✅ Exported {len(csv_data)} leads to {export_path}")
        return export_path
    
    def generate_email_campaign(self, leads, template_type="audit"):
        """
        Generate email campaign for high-scoring leads
        """
        high_score_leads = [lead for lead in leads if lead.get('lead_score', 0) >= 70]
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M")
        campaign_dir = self.base_dir / "emails" / f"campaign_{timestamp}"
        campaign_dir.mkdir(exist_ok=True)
        
        email_files = []
        for i, lead in enumerate(high_score_leads, 1):
            email_content = self.generate_email_content(lead, template_type)
            
            email_filename = f"email_{i:03d}_{lead['name'].replace(' ', '_')}.txt"
            email_path = campaign_dir / email_filename
            
            with open(email_path, 'w', encoding='utf-8') as f:
                f.write(f"TO: {lead.get('decision_makers', [{}])[0].get('email', 'no-email@example.com')}\n")
                f.write(f"BUSINESS: {lead['name']}\n")
                f.write(f"SCORE: {lead.get('lead_score', 0)}\n")
                f.write("=" * 50 + "\n\n")
                f.write(email_content)
            
            email_files.append(email_path)
        
        print(f"✅ Generated {len(email_files)} personalized emails in {campaign_dir}")
        return campaign_dir, email_files
    
    def run_lead_generation(self, location, industry, limit=100):
        """
        Run complete lead generation process
        """
        print("🚀 Starting WebLaunch Lab Lead Generation...")
        print("=" * 50)
        
        # Step 1: Find businesses
        businesses = self.search_local_businesses(location, industry, limit)
        print(f"✅ Found {len(businesses)} businesses")
        
        # Step 2: Enrich data
        print("🔍 Enriching business data...")
        enriched_leads = []
        for business in businesses:
            enriched = self.enrich_business_data(business)
            enriched_leads.append(enriched)
            print(f"   Processed: {business['name']} (Score: {enriched['lead_score']})")
        
        # Step 3: Filter high-quality leads
        high_score_leads = [lead for lead in enriched_leads if lead.get('lead_score', 0) >= 70]
        print(f"✅ {len(high_score_leads)} high-quality leads (70+ score)")
        
        # Step 4: Export leads
        export_path = self.export_leads(enriched_leads)
        
        # Step 5: Generate email campaign
        campaign_dir, email_files = self.generate_email_campaign(enriched_leads)
        
        # Step 6: Summary report
        print("\n" + "=" * 50)
        print("📊 LEAD GENERATION SUMMARY")
        print("=" * 50)
        print(f"Total businesses found: {len(businesses)}")
        print(f"High-quality leads (70+): {len(high_score_leads)}")
        print(f"Average lead score: {sum(lead.get('lead_score', 0) for lead in enriched_leads) / len(enriched_leads):.1f}")
        print(f"Leads exported to: {export_path}")
        print(f"Email campaign ready: {campaign_dir}")
        
        # Top 5 leads
        top_leads = sorted(enriched_leads, key=lambda x: x.get('lead_score', 0), reverse=True)[:5]
        print(f"\n🎯 TOP 5 LEADS:")
        for i, lead in enumerate(top_leads, 1):
            dm = lead.get('decision_makers', [{}])[0]
            print(f"   {i}. {lead['name']} (Score: {lead.get('lead_score', 0)}) - {dm.get('email', 'No email')}")
        
        print(f"\n🚀 Ready to start outreach! Check {campaign_dir} for personalized emails.")
        
        return enriched_leads, export_path, campaign_dir

def main():
    """
    Main function to run lead generation
    """
    generator = LocalLeadGenerator()
    
    # Configuration - customize these
    TARGET_LOCATION = "Your City, State"  # Change this
    TARGET_INDUSTRY = "Professional Services"  # or "Healthcare", "Home Services", etc.
    LEAD_LIMIT = 50  # Start small, scale up
    
    # Run the lead generation
    leads, export_path, campaign_dir = generator.run_lead_generation(
        location=TARGET_LOCATION,
        industry=TARGET_INDUSTRY, 
        limit=LEAD_LIMIT
    )
    
    print(f"\n✅ Lead generation complete!")
    print(f"📁 Check your files:")
    print(f"   Leads database: {export_path}")
    print(f"   Email campaign: {campaign_dir}")

if __name__ == "__main__":
    main()