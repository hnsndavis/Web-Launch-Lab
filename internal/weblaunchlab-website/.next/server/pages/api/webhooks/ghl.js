"use strict";(()=>{var e={};e.id=918,e.ids=[918],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},9648:e=>{e.exports=import("axios")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},90:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{config:()=>d,default:()=>l,routeModule:()=>u});var n=a(1802),s=a(7153),o=a(6249),c=a(2831),i=e([c]);c=(i.then?(await i)():i)[0];let l=(0,o.l)(c,"default"),d=(0,o.l)(c,"config"),u=new n.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/webhooks/ghl",pathname:"/api/webhooks/ghl",bundlePath:"",filename:""},userland:c});r()}catch(e){r(e)}})},818:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.d(t,{Z:()=>c});var n=a(9648),s=e([n]);n=(s.then?(await s)():s)[0];class o{constructor(){this.apiKey=process.env.ANTHROPIC_API_KEY,this.baseURL="https://api.anthropic.com/v1",this.client=n.default.create({baseURL:this.baseURL,headers:{"x-api-key":this.apiKey,"Content-Type":"application/json","anthropic-version":"2023-06-01"}})}async generatePersonalizedOutreach(e,t="initial"){let a=`Generate a personalized outreach email for:
    
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
    
    Return only the numeric score (0-100).`;try{let e=await this.client.post("/messages",{model:"claude-3-haiku-20240307",max_tokens:50,messages:[{role:"user",content:t}]});return parseInt(e.data.content[0].text.trim())}catch(e){return console.error("Error scoring lead:",e.response?.data||e.message),50}}}let c=new o;r()}catch(e){r(e)}})},1507:(e,t,a)=>{a.d(t,{O:()=>s});let r=require("@supabase/supabase-js"),n=process.env.SUPABASE_SERVICE_ROLE_KEY||"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcmR3aHl0amNscXhseXZtb3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDkzNTYsImV4cCI6MjA3MDA4NTM1Nn0.SXgOgImK9bt4goKllLFP5kIlzRnb-aHsLvpcDggEIW0",s=(0,r.createClient)("https://kcrdwhytjclqxlyvmowd.supabase.co",n)},357:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.d(t,{Z:()=>c});var n=a(9648),s=e([n]);n=(s.then?(await s)():s)[0];class o{constructor(){this.apiKey=process.env.GHL_API_KEY,this.agencyId=process.env.GHL_AGENCY_ID,this.baseURL="https://rest.gohighlevel.com/v1",this.client=n.default.create({baseURL:this.baseURL,headers:{Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json"}})}async createContact(e){try{return(await this.client.post("/contacts",{...e,locationId:this.agencyId})).data}catch(e){throw console.error("Error creating GHL contact:",e.response?.data||e.message),e}}async updateContact(e,t){try{return(await this.client.put(`/contacts/${e}`,t)).data}catch(e){throw console.error("Error updating GHL contact:",e.response?.data||e.message),e}}async getContacts(e={}){try{return(await this.client.get("/contacts",{params:e})).data}catch(e){throw console.error("Error fetching GHL contacts:",e.response?.data||e.message),e}}async triggerWorkflow(e,t){try{return(await this.client.post("/workflows/trigger",{contactId:e,workflowId:t})).data}catch(e){throw console.error("Error triggering workflow:",e.response?.data||e.message),e}}async createSubAccount(e){try{return(await this.client.post("/sub-accounts",{name:e.name,address:e.address||"",city:e.city||"",state:e.state||"",country:e.country||"US",postalCode:e.postalCode||"",website:e.website||"",timezone:e.timezone||"America/New_York"})).data}catch(e){throw console.error("Error creating sub-account:",e.response?.data||e.message),e}}async getSubAccount(e){try{return(await this.client.get(`/sub-accounts/${e}`)).data}catch(e){throw console.error("Error fetching sub-account:",e.response?.data||e.message),e}}async createCampaign(e){try{return(await this.client.post("/campaigns",{...e,locationId:this.agencyId})).data}catch(e){throw console.error("Error creating campaign:",e.response?.data||e.message),e}}async updateOpportunity(e,t,a=null){try{let r={pipelineStageId:t};return a&&(r.monetaryValue=a),(await this.client.put(`/opportunities/${e}`,r)).data}catch(e){throw console.error("Error updating opportunity:",e.response?.data||e.message),e}}}let c=new o;r()}catch(e){r(e)}})},2831:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{default:()=>i});var n=a(1507),s=a(357),o=a(818),c=e([s,o]);async function i(e,t){if("POST"!==e.method)return t.status(405).json({error:"Method not allowed"});try{let{type:a,data:r}=e.body;switch(a){case"contact.created":await l(r);break;case"contact.updated":await d(r);break;case"opportunity.stage_changed":await u(r);break;default:console.log("Unhandled webhook type:",a)}t.status(200).json({success:!0})}catch(e){console.error("Webhook error:",e),t.status(500).json({error:"Internal server error"})}}async function l(e){try{let t=await o.Z.scoreLeadQuality({industry:e.customFields?.industry||"Unknown",companySize:e.customFields?.companySize,hasWebsite:e.customFields?.hasWebsite==="true",budgetRange:e.customFields?.budget,engagementLevel:"New",source:e.source||"Unknown"}),a=`
      INSERT INTO leads (ghl_contact_id, email, phone, name, company, industry, source, score)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (ghl_contact_id) DO UPDATE SET
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        name = EXCLUDED.name,
        company = EXCLUDED.company,
        industry = EXCLUDED.industry,
        source = EXCLUDED.source,
        score = EXCLUDED.score,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `,r=[e.id,e.email,e.phone,e.firstName+" "+(e.lastName||""),e.customFields?.company||"",e.customFields?.industry||"Unknown",e.source||"Unknown",t];await n.pool.query(a,r),t>=80&&await s.Z.triggerWorkflow(e.id,process.env.HIGH_PRIORITY_WORKFLOW_ID),console.log("New lead processed:",e.email,"Score:",t)}catch(e){console.error("Error handling new lead:",e)}}async function d(e){try{let t=`
      UPDATE leads 
      SET email = $2, phone = $3, name = $4, company = $5, updated_at = CURRENT_TIMESTAMP
      WHERE ghl_contact_id = $1
    `,a=[e.id,e.email,e.phone,e.firstName+" "+(e.lastName||""),e.customFields?.company||""];await n.pool.query(t,a),console.log("Lead updated:",e.email)}catch(e){console.error("Error updating lead:",e)}}async function u(e){try{let t="contacted";switch(e.pipelineStageId){case process.env.GHL_QUALIFIED_STAGE_ID:t="qualified";break;case process.env.GHL_PROPOSAL_STAGE_ID:t="proposal";break;case process.env.GHL_WON_STAGE_ID:t="won",await p(e);break;case process.env.GHL_LOST_STAGE_ID:t="lost"}await n.pool.query("UPDATE leads SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE ghl_contact_id = $2",[t,e.contactId]),console.log("Lead status updated:",e.contactId,t)}catch(e){console.error("Error handling stage change:",e)}}async function p(e){try{let t=await n.pool.query("SELECT * FROM leads WHERE ghl_contact_id = $1",[e.contactId]);if(0===t.rows.length)return;let a=t.rows[0],r=`
      INSERT INTO projects (lead_id, name, status, setup_fee, monthly_fee)
      VALUES ($1, $2, 'pending', 497.00, 49.00)
      RETURNING id
    `,s=`${a.company||a.name} Website`;await n.pool.query(r,[a.id,s]),console.log("Project created for won lead:",s)}catch(e){console.error("Error creating project from won lead:",e)}}[s,o]=c.then?(await c)():c,r()}catch(e){r(e)}})},7153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},1802:(e,t,a)=>{e.exports=a(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var a=t(t.s=90);module.exports=a})();