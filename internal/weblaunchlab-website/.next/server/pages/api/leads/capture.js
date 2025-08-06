"use strict";(()=>{var e={};e.id=943,e.ids=[943],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},9648:e=>{e.exports=import("axios")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},135:(e,t,a)=>{a.a(e,async(e,s)=>{try{a.r(t),a.d(t,{config:()=>d,default:()=>l,routeModule:()=>u});var r=a(1802),n=a(7153),o=a(6249),i=a(6127),c=e([i]);i=(c.then?(await c)():c)[0];let l=(0,o.l)(i,"default"),d=(0,o.l)(i,"config"),u=new r.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/leads/capture",pathname:"/api/leads/capture",bundlePath:"",filename:""},userland:i});s()}catch(e){s(e)}})},818:(e,t,a)=>{a.a(e,async(e,s)=>{try{a.d(t,{Z:()=>i});var r=a(9648),n=e([r]);r=(n.then?(await n)():n)[0];class o{constructor(){this.apiKey=process.env.ANTHROPIC_API_KEY,this.baseURL="https://api.anthropic.com/v1",this.client=r.default.create({baseURL:this.baseURL,headers:{"x-api-key":this.apiKey,"Content-Type":"application/json","anthropic-version":"2023-06-01"}})}async generatePersonalizedOutreach(e,t="initial"){let a=`Generate a personalized outreach email for:
    
    Lead Details:
    - Name: ${e.name}
    - Company: ${e.company}
    - Industry: ${e.industry}
    - Source: ${e.source}
    
    Email Type: ${t}
    
    Our Service: Professional websites for $497 setup + $49/month maintenance
    
    Requirements:
    - Professional but conversational tone
    - Industry-specific pain points
    - Clear value proposition
    - Soft call-to-action
    - Maximum 150 words
    
    Return only the email body, no subject line.`;try{return(await this.client.post("/messages",{model:"claude-3-haiku-20240307",max_tokens:300,messages:[{role:"user",content:a}]})).data.content[0].text.trim()}catch(e){throw console.error("Error generating outreach:",e.response?.data||e.message),e}}async generateWebsiteContent(e){let t=`Generate website content for:
    
    Business: ${e.businessName}
    Industry: ${e.industry}
    Services: ${e.services.join(", ")}
    Target Audience: ${e.targetAudience}
    Unique Value Prop: ${e.uniqueValue}
    
    Generate:
    1. Compelling headline (max 10 words)
    2. Subheadline (max 20 words)  
    3. 3 key benefits (max 15 words each)
    4. Call-to-action text (max 5 words)
    5. About section (max 100 words)
    
    Return as JSON format.`;try{let e=await this.client.post("/messages",{model:"claude-3-sonnet-20240229",max_tokens:500,messages:[{role:"user",content:t}]});return JSON.parse(e.data.content[0].text)}catch(e){throw console.error("Error generating website content:",e.response?.data||e.message),e}}async generateProjectTimeline(e){let t=`Create a project timeline for:
    
    Project Type: ${e.packageType}
    Industry: ${e.industry}
    Special Requirements: ${e.requirements||"Standard website"}
    
    Generate realistic timeline with:
    - Phase names
    - Duration in days
    - Key deliverables
    - Client actions needed
    
    Return as JSON array of phases.`;try{let e=await this.client.post("/messages",{model:"claude-3-haiku-20240307",max_tokens:400,messages:[{role:"user",content:t}]});return JSON.parse(e.data.content[0].text)}catch(e){throw console.error("Error generating timeline:",e.response?.data||e.message),e}}async scoreLeadQuality(e){let t=`Score this lead quality from 0-100:
    
    Lead Data:
    - Industry: ${e.industry}
    - Company Size: ${e.companySize||"Unknown"}
    - Current Website: ${e.hasWebsite?"Yes":"No"}
    - Budget Indication: ${e.budgetRange||"Unknown"}
    - Engagement Level: ${e.engagementLevel||"Unknown"}
    - Source: ${e.source}
    
    Return only the numeric score (0-100).`;try{let e=await this.client.post("/messages",{model:"claude-3-haiku-20240307",max_tokens:50,messages:[{role:"user",content:t}]});return parseInt(e.data.content[0].text.trim())}catch(e){return console.error("Error scoring lead:",e.response?.data||e.message),50}}}let i=new o;s()}catch(e){s(e)}})},1507:(e,t,a)=>{a.d(t,{O:()=>n});let s=require("@supabase/supabase-js"),r=process.env.SUPABASE_SERVICE_ROLE_KEY||"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcmR3aHl0amNscXhseXZtb3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDkzNTYsImV4cCI6MjA3MDA4NTM1Nn0.SXgOgImK9bt4goKllLFP5kIlzRnb-aHsLvpcDggEIW0",n=(0,s.createClient)("https://kcrdwhytjclqxlyvmowd.supabase.co",r)},2226:(e,t,a)=>{a.a(e,async(e,s)=>{try{a.d(t,{Z:()=>i});var r=a(9648),n=e([r]);r=(n.then?(await n)():n)[0];class o{constructor(){this.apiToken=process.env.HUBSPOT_API_TOKEN,this.baseURL="https://api.hubspot.com",this.client=r.default.create({baseURL:this.baseURL,headers:{Authorization:`Bearer ${this.apiToken}`,"Content-Type":"application/json"}})}async createContact(e){try{return(await this.client.post("/crm/v3/objects/contacts",{properties:{email:e.email,firstname:e.firstName||e.name?.split(" ")[0]||"",lastname:e.lastName||e.name?.split(" ")[1]||"",phone:e.phone||"",company:e.company||"",website:e.website||"",hs_lead_status:"NEW",lifecyclestage:"lead",hs_analytics_source:"Manual Entry"===e.source?"OFFLINE":"DIRECT_TRAFFIC"}})).data}catch(e){throw console.error("Error creating HubSpot contact:",e.response?.data||e.message),e}}async updateContact(e,t){try{return(await this.client.patch(`/crm/v3/objects/contacts/${e}`,{properties:t})).data}catch(e){throw console.error("Error updating HubSpot contact:",e.response?.data||e.message),e}}async getContacts(e=100,t=null){try{let a={limit:e};return t&&(a.after=t),(await this.client.get("/crm/v3/objects/contacts",{params:a})).data}catch(e){throw console.error("Error fetching HubSpot contacts:",e.response?.data||e.message),e}}async findContactByEmail(e){try{return(await this.client.post("/crm/v3/objects/contacts/search",{filterGroups:[{filters:[{propertyName:"email",operator:"EQ",value:e}]}]})).data.results[0]||null}catch(e){return console.error("Error finding contact by email:",e.response?.data||e.message),null}}async deleteContact(e){try{return(await this.client.delete(`/crm/v3/objects/contacts/${e}`)).data}catch(e){throw console.error("Error deleting HubSpot contact:",e.response?.data||e.message),e}}async createDeal(e){try{return(await this.client.post("/crm/v3/objects/deals",{properties:{dealname:e.name||`${e.company||"Lead"} - Website Project`,amount:e.amount||"",dealstage:e.stage||"appointmentscheduled",pipeline:e.pipeline||"default",hubspot_owner_id:e.ownerId||"",closedate:e.closeDate||"",deal_type:e.type||"newbusiness",hs_analytics_source:"Manual Entry"===e.source?"OFFLINE":"DIRECT_TRAFFIC"},associations:e.contactId?[{to:{id:e.contactId},types:[{associationCategory:"HUBSPOT_DEFINED",associationTypeId:3}]}]:[]})).data}catch(e){throw console.error("Error creating HubSpot deal:",e.response?.data||e.message),e}}async updateDeal(e,t){try{return(await this.client.patch(`/crm/v3/objects/deals/${e}`,{properties:t})).data}catch(e){throw console.error("Error updating HubSpot deal:",e.response?.data||e.message),e}}async getDeals(e=100,t=null){try{let a={limit:e,properties:"dealname,amount,dealstage,pipeline,closedate,createdate,hs_lastmodifieddate,hubspot_owner_id,deal_type,lead_source"};return t&&(a.after=t),(await this.client.get("/crm/v3/objects/deals",{params:a})).data}catch(e){throw console.error("Error fetching HubSpot deals:",e.response?.data||e.message),e}}async getPipelines(){try{return(await this.client.get("/crm/v3/pipelines/deals")).data}catch(e){throw console.error("Error fetching pipelines:",e.response?.data||e.message),e}}async createLeadWithDeal(e){try{console.log("Creating lead with data:",e);let t=await this.findContactByEmail(e.email);t?console.log("Contact already exists:",t.id):(console.log("Contact not found, creating new contact"),t=await this.createContact(e),console.log("Contact created:",t.id)),console.log("Creating deal for contact:",t.id);let a=await this.createDeal({...e,contactId:t.id});return console.log("Deal created:",a.id),{contact:t,deal:a}}catch(e){throw console.error("Error creating lead with deal:",e.response?.data||e.message),e}}async addNote(e,t,a){try{return(await this.client.post("/crm/v3/objects/notes",{properties:{hs_note_body:a,hs_timestamp:new Date().toISOString()},associations:[{to:{id:t},types:[{associationCategory:"HUBSPOT_DEFINED",associationTypeId:"contact"===e?202:214}]}]})).data}catch(e){throw console.error("Error adding note:",e.response?.data||e.message),e}}}let i=new o;s()}catch(e){s(e)}})},6127:(e,t,a)=>{a.a(e,async(e,s)=>{try{a.r(t),a.d(t,{default:()=>c});var r=a(1507),n=a(2226),o=a(818),i=e([n,o]);async function c(e,t){if("POST"!==e.method)return t.status(405).json({error:"Method not allowed"});try{let{email:a,phone:s,name:i,company:c,source:l}=e.body;if(!a)return t.status(400).json({error:"Email is required"});let d=await n.Z.createLeadWithDeal({email:a,phone:s||"",name:i||"",company:c||"",source:l||"website",amount:"",stage:"appointmentscheduled"}),u=await o.Z.scoreLeadQuality({industry:"Unknown",hasWebsite:!1,engagementLevel:"New",source:l||"website"}),p=`
      INSERT INTO leads (hubspot_contact_id, hubspot_deal_id, email, phone, name, company, source, score, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'new')
      ON CONFLICT (hubspot_contact_id) DO UPDATE SET
        hubspot_deal_id = EXCLUDED.hubspot_deal_id,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        name = EXCLUDED.name,
        company = EXCLUDED.company,
        source = EXCLUDED.source,
        score = EXCLUDED.score,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `,m=[d.contact.id,d.deal.id,a,s||null,i||"",c||"",l||"website",u],h=await r.pool.query(p,m);if(i&&c){let e=await o.Z.generatePersonalizedOutreach({name:i,company:c,industry:"Unknown",source:l||"website"});await n.Z.addNote("deal",d.deal.id,`Personalized follow-up: ${e}`)}t.status(200).json({success:!0,leadId:h.rows[0].id,score:u})}catch(e){console.error("Lead capture error:",e),t.status(500).json({error:"Failed to capture lead"})}}[n,o]=i.then?(await i)():i,s()}catch(e){s(e)}})},7153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},1802:(e,t,a)=>{e.exports=a(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var a=t(t.s=135);module.exports=a})();