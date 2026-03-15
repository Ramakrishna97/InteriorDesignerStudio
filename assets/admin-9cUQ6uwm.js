var w=Object.defineProperty;var v=(i,e,o)=>e in i?w(i,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):i[e]=o;var h=(i,e,o)=>v(i,typeof e!="symbol"?e+"":e,o);import"./global-iaosacMP.js";class ${constructor(e,o,t){Object.defineProperty(this,"baseUrl",{enumerable:!0,configurable:!0,writable:!0,value:"https://api.github.com"}),Object.defineProperty(this,"token",{enumerable:!0,configurable:!0,writable:!0,value:""}),Object.defineProperty(this,"owner",{enumerable:!0,configurable:!0,writable:!0,value:""}),Object.defineProperty(this,"repo",{enumerable:!0,configurable:!0,writable:!0,value:""}),this.token=e,this.owner=o,this.repo=t}async request(e,o,t){const r=`${this.baseUrl}${o}`,s={method:e,headers:{Authorization:`token ${this.token}`,"Content-Type":"application/json",Accept:"application/vnd.github.v3+json"}};t&&(s.body=JSON.stringify(t));const a=await fetch(r,s);if(!a.ok){let l=null;try{l=await a.json()}catch{}const u=l?JSON.stringify(l):"";throw new Error(`GitHub API Error (${a.status} ${a.statusText}) ${u} - ${o}`)}return a.json()}async createBlob(e,o="utf-8"){return(await this.request("POST",`/repos/${this.owner}/${this.repo}/git/blobs`,{content:e,encoding:o})).sha}async getFileContent(e){const t=await this.request("GET",`/repos/${this.owner}/${this.repo}/contents/${e}`);if(t.content&&typeof t.content=="string")return decodeURIComponent(atob(t.content).split("").map(r=>`%${`00${r.charCodeAt(0).toString(16)}`.slice(-2)}`).join(""));throw new Error("Could not decode file content")}async createCommit(e,o){let t=!1,r,s;try{const p=(await this.request("GET",`/repos/${this.owner}/${this.repo}/git/refs/heads/main`)).object;r=(await this.request("GET",`/repos/${this.owner}/${this.repo}/git/commits/${p.sha}`)).tree.sha,s=p.sha}catch{t=!0}const a=[];for(const n of o){const c=await this.createBlob(n.content,n.encoding||"utf-8");a.push({path:n.path,mode:"100644",type:"blob",sha:c})}let l;t?l=await this.request("POST",`/repos/${this.owner}/${this.repo}/git/trees`,{tree:a}):l=await this.request("POST",`/repos/${this.owner}/${this.repo}/git/trees`,{base_tree:r,tree:a});const d={message:e,tree:l.sha};!t&&s&&(d.parents=[s]);const m=await this.request("POST",`/repos/${this.owner}/${this.repo}/git/commits`,d);if(t)try{await this.request("POST",`/repos/${this.owner}/${this.repo}/git/refs`,{ref:"refs/heads/main",sha:m.sha})}catch{try{await this.request("PATCH",`/repos/${this.owner}/${this.repo}/git/refs/heads/main`,{sha:m.sha,force:!0})}catch(c){throw c}}else await this.request("PATCH",`/repos/${this.owner}/${this.repo}/git/refs/heads/main`,{sha:m.sha,force:!0});return m.sha}async validateToken(){try{return await this.request("GET","/user"),!0}catch{return!1}}}function j(i){const e=[];return(!i.title||i.title.trim().length===0)&&e.push({field:"title",message:"Project title is required"}),(!i.description||i.description.trim().length===0)&&e.push({field:"description",message:"Project description is required"}),(!i.shortDescription||i.shortDescription.trim().length===0)&&e.push({field:"shortDescription",message:"Short description is required"}),(!i.category||i.category.trim().length===0)&&e.push({field:"category",message:"Category is required"}),(!i.completionDate||i.completionDate.trim().length===0)&&e.push({field:"completionDate",message:"Completion date is required"}),(!i.images||i.images.length===0)&&e.push({field:"images",message:"At least one project image is required"}),i.images&&i.images.length>0&&i.images.forEach((o,t)=>{o.type.startsWith("image/")||e.push({field:`images[${t}]`,message:"All files must be images"}),o.size>5*1024*1024&&e.push({field:`images[${t}]`,message:"Image files must be under 5MB each"})}),e}function I(i){return i.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-")}function P(i){return i.replace(/[^a-zA-Z0-9._-]/g,"_")}class E{constructor(){h(this,"ghapi",null);h(this,"config",null);h(this,"isProd",!0);this.loadConfig()}async loadConfig(){try{if(this.isProd)this.config={admins:[{username:"admin",password:"admin123"}]};else{const e=await fetch("/InteriorDesignerStudio/admin-config.json");if(!e.ok)throw new Error("Failed to load admin configuration");this.config=await e.json()}this.renderLoginForm()}catch(e){console.error("Admin config load failed:",e);const o=document.getElementById("app");o&&(o.innerHTML=`
          <div style="color:red;padding:20px;text-align:center">
            <h2>Configuration Error</h2>
            <p>Could not load admin-config.json</p>
          </div>`)}}renderLoginForm(){const e=document.getElementById("app");if(!e)return;e.innerHTML=`
      <div class="admin-container">
        <h1 class="admin-header">Interior Design Admin</h1>
        <form id="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" placeholder="Enter username" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" placeholder="Enter password" required />
          </div>
          <div class="form-group">
            <button type="submit" class="btn">Login</button>
          </div>
          <div id="auth-status" class="status"></div>
        </form>
      </div>
    `;const o=document.getElementById("login-form"),t=document.getElementById("auth-status");o.addEventListener("submit",r=>{r.preventDefault();const s=document.getElementById("username").value,a=document.getElementById("password").value;this.validateCredentials(s,a)?(t.textContent="Login successful",setTimeout(()=>this.renderProjectForm(),500)):t.textContent="Invalid credentials"})}validateCredentials(e,o){return this.config?this.config.admins.some(t=>t.username===e&&t.password===o):!1}renderProjectForm(){const e=document.getElementById("app");if(!e)return;e.innerHTML=`
      <div class="admin-container">
        <h1 class="admin-header">Upload Project</h1>
        <form id="project-form">
          <div class="form-group">
            <label for="title">Project Title</label>
            <input id="title" placeholder="Project title" required />
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" required>
              <option value="">Select category</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Interior Design">Interior Design</option>
              <option value="Renovation">Renovation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="short-description">Short Description</label>
            <input id="short-description" placeholder="Short description" required />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" placeholder="Full description"></textarea>
          </div>

          <div class="form-group">
            <label for="completion-date">Completion Date</label>
            <input id="completion-date" type="date" required />
          </div>

          <div class="form-group">
            <label for="location">Location</label>
            <input id="location" placeholder="Location" />
          </div>

          <div class="form-group">
            <label for="client">Client</label>
            <input id="client" placeholder="Client" />
          </div>

          <div class="form-group">
            <label for="hero-image">Hero Image</label>
            <input id="hero-image" type="file" accept="image/*" required />
          </div>

          <div class="form-group">
            <label for="images">Project Images</label>
            <input id="images" type="file" multiple accept="image/*" required />
          </div>

          <div class="form-group">
            <button type="submit" class="btn">Upload</button>
          </div>

          <div id="submit-status" class="status"></div>
        </form>
      </div>
    `;const o=document.getElementById("project-form"),t=document.getElementById("submit-status");o.addEventListener("submit",r=>this.handleProjectSubmit(r,t))}async handleProjectSubmit(e,o){if(e.preventDefault(),!this.config)return;const t={title:document.getElementById("title").value,category:document.getElementById("category").value,shortDescription:document.getElementById("short-description").value,description:document.getElementById("description").value,completionDate:document.getElementById("completion-date").value,location:document.getElementById("location").value,client:document.getElementById("client").value,heroImageFile:document.getElementById("hero-image").files?.[0],images:Array.from(document.getElementById("images").files||[])},r=j(t);if(t.category||r.push({field:"category",message:"Category is required"}),r.length>0){o.textContent=r.map(s=>s.message).join(", ");return}o.textContent="Uploading...";try{const s=I(t.title||""),a=t.heroImageFile?await this.readFileAsBase64(t.heroImageFile):"",l=await Promise.all((t.images||[]).map(async n=>({name:P(n.name),data:await this.readFileAsBase64(n)}))),u={slug:s,...t,heroImage:a,images:l},d=this.isProd?`content/projects/${s}`:`public/content/projects/${s}`,g=this.isProd?"/InteriorDesignerStudio/":"/InteriorDesignerStudio/public/",m={slug:s,title:t.title,category:t.category,description:t.description,shortDescription:t.shortDescription,completionDate:t.completionDate,location:t.location,client:t.client,heroImage:`${g}content/projects/${s}/hero.jpg`,images:l.map((n,c)=>({url:`${g}content/projects/${s}/image-${c+1}.jpg`,alt:`Image ${c+1}`}))};if(this.isProd){if(!(await fetch("/api/trigger-upload",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)})).ok)throw new Error("Upload failed");o.innerHTML="Project submitted successfully ✓<br>GitHub Actions workflow will commit the files."}else{if(!this.config.github)throw new Error("GitHub config missing for local");this.ghapi=new $(this.config.github.pat,this.config.github.owner,this.config.github.repo);const n=[{path:`${d}/hero.jpg`,content:a,encoding:"base64"}];l.forEach((f,y)=>n.push({path:`${d}/image-${y+1}.jpg`,content:f.data,encoding:"base64"})),n.push({path:`${d}/metadata.json`,content:JSON.stringify(m,null,2),encoding:"utf-8"});const c="public/content/projects/index.json";let p=[];try{p=await(await fetch(`/InteriorDesignerStudio/${c}`)).json()}catch{}p.push(s),n.push({path:c,content:JSON.stringify([...new Set(p)],null,2),encoding:"utf-8"});const b=await this.ghapi.createCommit(`Add project: ${t.title}`,n);o.innerHTML=`Project uploaded ✓ <br> Commit ${b.slice(0,7)}`}}catch(s){console.error(s),o.textContent="Upload failed"}}async readFileAsBase64(e){return new Promise((o,t)=>{const r=new FileReader;r.onload=()=>{typeof r.result=="string"?o(r.result.split(",")[1]):t("Failed to read file as base64")},r.onerror=t,r.readAsDataURL(e)})}}new E;
