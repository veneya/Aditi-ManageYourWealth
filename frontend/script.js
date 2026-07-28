const questions = [
  { id:'gender', title:'What is your gender?', options:['Male','Female','Other / LGBTQ+'] },
  { id:'age', title:'What is your age group?', options:['18–25 years','26–35 years','36–45 years','46 and above'] },
  { id:'marital', title:'What is your marital status?', options:['Single','Married','Divorced','Widow'] },
  { id:'income', title:'What is your annual household income?', options:['Under ₹3 lakh','₹3–6 lakh','Above ₹6 lakh'] },
  { id:'home', title:'Do you currently own a home?', options:['Own house','Renting','No house'] },
  { id:'employment', title:'What best describes your employment?', options:['Salaried','Self-employed','Homemaker'] },
  { id:'state', title:'Which state or UT do you live in?', options:['North India','South India','East India','West India'] },
  { id:'bank', title:'Do you have an active bank account?', options:['Yes, Aadhaar linked','Yes, not linked','No bank account'] },
  { id:'category', title:'Which category do you belong to?', options:['General / EWS','OBC','SC / ST'] },
  { id:'daughter', title:'Do you have a daughter under 10 years old?', options:['Yes','No'] },
  { id:'business', title:'Are you planning to start or expand a business?', options:['Yes, starting new','Yes, expanding existing','Not planning to'] }
];

function goTo(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}

let current = 0;
const answers = new Array(questions.length).fill(null);

const qTitle = document.getElementById('qTitle');
const qOptions = document.getElementById('qOptions');
const qCount = document.getElementById('qCount');
const progressFill = document.getElementById('progressFill');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const ctaBtn = document.getElementById('ctaBtn');
const ctaLabel = document.getElementById('ctaLabel');
const ctaSpinner = document.getElementById('ctaSpinner');
const stepList = document.getElementById('stepList');

function renderSteps(){
  stepList.innerHTML = questions.map((q,i)=>`
    <div class="step-item ${i<current ? 'done': ''}">
      <span class="step-num">${i<current ? '✓' : i+1}</span>
      <span>${q.title.replace('?','')}</span>
    </div>`).slice(Math.max(0,current-1), current+3).join('');
}

function renderQuestion(){
  const q = questions[current];
  qTitle.textContent = q.title;
  qCount.textContent = `Question ${current+1} of ${questions.length}`;
  progressFill.style.width = `${((current+1)/questions.length)*100}%`;
  qOptions.innerHTML = '';
  q.options.forEach(opt => {
    const div = document.createElement('div');
    div.className = 'option-pill' + (answers[current]===opt ? ' selected' : '');
    div.innerHTML = `<span class="option-dot"></span>${opt}`;
    div.onclick = () => { answers[current]=opt; renderQuestion(); };
    qOptions.appendChild(div);
  });
  backBtn.disabled = current===0;
  nextBtn.disabled = !answers[current];
  nextBtn.textContent = current===questions.length-1 ? 'Submit the quiz' : 'Next';
  renderSteps();
  updateCta();
}

function updateCta(){
  const allAnswered = answers.every(a=>a!==null);
  ctaBtn.disabled = !allAnswered;
  ctaLabel.textContent = allAnswered ? 'Match my schemes' : 'Complete the quiz to continue';
}

backBtn.onclick = () => { if(current>0){ current--; renderQuestion(); } };
nextBtn.onclick = () => {
  if(current < questions.length-1){
    current++; renderQuestion();
  } else if(answers[current]){
    submitQuiz();
  }
};

renderQuestion();

const schemesData = {
  mudra: {
    name:'Mudra Loan', icon:'💼',
    benefits:['Collateral-free loans up to ₹10 lakh','Shishu, Kishor and Tarun loan tiers','Low interest, flexible repayment'],
    docs:'Aadhaar, PAN, business plan, address proof, 6-month bank statement, passport photo',
    portal:'Any nationalised bank, RRB or MFI · mudra.org.in',
    link:'https://www.mudra.org.in/'
  },
  standup: {
    name:'Stand-Up India', icon:'🚀',
    benefits:['Loans ₹10 lakh – ₹1 crore for new ventures','For women and SC/ST entrepreneurs','Composite loan for term + working capital'],
    docs:'Aadhaar, PAN, caste certificate (if applicable), project report, address proof, bank details',
    portal:'Public sector banks · standupmitra.in',
    link:'https://www.standupmitra.in/'
  },
  ssy: {
    name:'Sukanya Samriddhi Yojana', icon:'👧',
    benefits:['High interest savings for girl child','Tax benefits under Section 80C','Matures at 21 years, partial withdrawal at 18'],
    docs:'Girl child birth certificate, parent/guardian Aadhaar, address proof, passport photo',
    portal:'Post office or authorised bank (SBI, ICICI, etc.) · indiapost.gov.in',
    link:'https://www.indiapost.gov.in/Financial/pages/content/sukanya-samriddhi-account.aspx'
  },
  vishwakarma: {
    name:'PM Vishwakarma Yojana', icon:'🛠️',
    benefits:['Collateral-free loans up to ₹3 lakh for artisans & craftsmen','Skill upgradation training with stipend','Toolkit incentive up to ₹15,000'],
    docs:'Aadhaar, PAN, ration card, trade/artisan certificate, bank passbook, passport photo',
    portal:'Common Service Centre (CSC) · pmvishwakarma.gov.in',
    link:'https://pmvishwakarma.gov.in/'
  },
  smile: {
    name:'SMILE Scheme (Garima Greh)', icon:'🏳️‍🌈',
    benefits:['Shelter, food, medical and skill support for transgender persons','Livelihood and vocational training assistance','Access to legal aid and counselling'],
    docs:'Aadhaar, Transgender ID card / self-declaration, address proof, passport photo',
    portal:'Ministry of Social Justice & Empowerment · smile.gov.in',
    link:'https://smilegov.in/'
  }
};

function computeRanking(){
  let scores = { mudra:20, standup:15, ssy:15, vishwakarma:15, smile:15 };
  const a = {};
  questions.forEach((q,i)=> a[q.id]=answers[i]);

  if(a.business && a.business.startsWith('Yes')) { scores.mudra += 45; scores.standup += 40; scores.vishwakarma += 30; }
  if(a.employment === 'Self-employed') { scores.mudra += 20; scores.standup += 10; scores.vishwakarma += 15; }
  if(a.category === 'SC / ST') scores.standup += 25;
  if(a.daughter === 'Yes') scores.ssy += 55;
  if(a.income === 'Under ₹3 lakh') scores.ssy += 10;
  if(a.bank && a.bank.startsWith('Yes')) { scores.mudra += 5; scores.standup += 5; scores.vishwakarma += 5; }
  if(a.employment === 'Homemaker') scores.ssy += 10;

  if(a.gender === 'Male'){ scores.vishwakarma += 40; scores.mudra += 10; scores.standup -= 15; scores.ssy -= 10; }
  if(a.gender === 'Female'){ scores.standup += 15; scores.ssy += 5; }
  if(a.gender === 'Other / LGBTQ+'){ scores.smile += 55; scores.mudra += 10; scores.standup -= 10; }

  // Only show schemes that are still relevant to this profile
  if(a.daughter !== 'Yes') delete scores.ssy;
  if(a.gender !== 'Other / LGBTQ+') delete scores.smile;
  // Stand-Up India is for women OR SC/ST entrepreneurs — drop it for men outside that category
  if(a.gender === 'Male' && a.category !== 'SC / ST') delete scores.standup;

  const order = Object.entries(scores).sort((x,y)=>y[1]-x[1]).slice(0,3);
  const labels = [
    {tag:'Most appropriate', cls:'most'},
    {tag:'Moderately appropriate', cls:'moderate'},
    {tag:'Least appropriate', cls:'least'}
  ];
  return order.map(([key,score],i)=>({
    key, score:Math.max(10,Math.min(96, score)), ...schemesData[key], ...labels[i]
  }));
}

function ringSvg(pct){
  const r=19, c=2*Math.PI*r;
  const offset = c - (pct/100)*c;
  return `<svg width="46" height="46" viewBox="0 0 46 46">
    <circle cx="23" cy="23" r="${r}" fill="none" stroke="rgba(122,90,200,0.15)" stroke-width="4"/>
    <circle cx="23" cy="23" r="${r}" fill="none" stroke="url(#ringGrad)" stroke-width="4" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${offset}" transform="rotate(-90 23 23)"/>
    <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7C4DFF"/><stop offset="100%" stop-color="#22B8AA"/>
    </linearGradient></defs>
  </svg>`;
}

function renderResults(matches) {

    const container = document.getElementById("rankedCards");

    container.innerHTML = matches.map(s => `
        <div class="scheme-card">

            <div class="scheme-top">

                <div class="scheme-name-block">

                    <p class="scheme-name">${s.name}</p>

                    <span class="badge">${s.match_label}</span>

                </div>

                <div class="match-pct">
                    ${s.match_score}%
                </div>

            </div>

            <p>${s.description}</p>

            <h4>Benefit</h4>

            <p>${s.benefit}</p>

            <h4>How to Apply</h4>

            <ul>

                ${s.how_to_apply
                    .map(step => `<li>${step}</li>`)
                    .join("")}

            </ul>

            <p><b>Source:</b> ${s.source}</p>

        </div>
    `).join("");

}

async function submitQuiz() {
  if (!answers.every(a => a !== null)) return;

  ctaSpinner.style.display = "inline-block";
  ctaLabel.textContent = "Matching your schemes...";
  ctaBtn.disabled = true;
  nextBtn.disabled = true;

  const payload = {
    gender: answers[0],
    age_group: answers[1],
    marital_status: answers[2],
    income_bracket: answers[3],
    home_status: answers[4],
    employment: answers[5],
    state_region: answers[6],
    bank_status: answers[7],
    category: answers[8],
    has_daughter: answers[9],
    business_plan: answers[10]
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    document.getElementById("results-section").style.display = "block";

    renderResults(data.matches);

    document
      .getElementById("results-section")
      .scrollIntoView({ behavior: "smooth" });

  } catch (err) {
    alert("Unable to connect to backend.");
    console.error(err);
  }

  ctaSpinner.style.display = "none";
}

ctaBtn.addEventListener('click', () => {
  if(ctaBtn.disabled) return;
  submitQuiz();
});

const askBtn = document.getElementById('askAditiBtn');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatLog = document.getElementById('chatLog');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

function openChat(){ chatWindow.style.display='flex'; chatInput.focus(); }
function closeChat(){ chatWindow.style.display='none'; }

askBtn.addEventListener('click', ()=>{
  chatWindow.style.display === 'flex' ? closeChat() : openChat();
});
chatClose.addEventListener('click', closeChat);

function addMsg(text, who){
  const div = document.createElement('div');
  div.className = 'chat-msg ' + who;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// function botReply(raw){
//   const q = raw.toLowerCase();
//   const has = (...words) => words.some(w => q.includes(w));

//   if(has('document','papers','documents needed','kyc')){
//     if(has('pmay','housing','home loan')) return "For PMAY you'll need: Aadhaar card, income certificate, address proof, a declaration that you don't own another pucca house, bank passbook, and a passport photo. Apply through pmaymis.gov.in or a partner bank.";
//     if(has('mudra')) return "For a Mudra Loan you'll need: Aadhaar, PAN, a simple business plan, address proof, 6 months of bank statements, and a passport photo. You can apply at any nationalised bank, RRB, or MFI, or via mudra.org.in.";
//     if(has('stand-up','stand up','standup')) return "For Stand-Up India you'll need: Aadhaar, PAN, a caste certificate if you're SC/ST, a project report, address proof, and bank account details. Apply through any public sector bank or standupmitra.in.";
//     if(has('sukanya','ssy','daughter')) return "For Sukanya Samriddhi Yojana you'll need: your daughter's birth certificate, the parent or guardian's Aadhaar, address proof, and a passport photo. Open the account at any post office or authorised bank like SBI or ICICI.";
//     return "Tell me which scheme you're asking about — PMAY, Mudra Loan, Stand-Up India, or Sukanya Samriddhi Yojana — and I'll list the exact documents you'll need.";
//   }

//   if(has('apply','portal','website','how do i','link')){
//     if(has('pmay','housing')) return "You can apply for PMAY at pmaymis.gov.in, or through any bank or housing finance company offering the Credit Linked Subsidy Scheme.";
//     if(has('mudra')) return "Apply for a Mudra Loan at any nationalised bank, regional rural bank, or microfinance institution, or start your application at mudra.org.in.";
//     if(has('stand-up','stand up','standup')) return "Apply for Stand-Up India through any public sector bank branch, or start online at standupmitra.in.";
//     if(has('sukanya','ssy')) return "Open a Sukanya Samriddhi account at your nearest post office or an authorised bank like SBI, ICICI, or PNB. Details are also on indiapost.gov.in.";
//     return "Take the eligibility quiz above and I'll match you to the right scheme with a direct link to its official application portal.";
//   }

//   if(has('eligible','eligibility','qualify')){
//     if(has('sukanya','ssy','daughter')) return "Sukanya Samriddhi Yojana is open to any parent or legal guardian of a girl child under 10 years old. One account per girl child, up to two per family.";
//     if(has('pmay','housing')) return "PMAY generally suits households earning under ₹6 lakh a year who don't already own a pucca house. Take the quiz above for a precise match.";
//     if(has('mudra')) return "Mudra Loans are open to any small business owner or aspiring entrepreneur — salaried, self-employed, or homemaker — needing funding up to ₹10 lakh.";
//     if(has('stand-up','stand up','standup')) return "Stand-Up India is for women entrepreneurs and SC/ST entrepreneurs starting a new greenfield venture in manufacturing, services, or trading.";
//     return "Eligibility depends on your income, housing status, employment, and a few other factors. The quickest way to check is the 10-question quiz above — want me to scroll you there?";
//   }

//   if(has('hi','hello','hey')) return "Hello! I can help with eligibility, required documents, or how to apply for any scheme on this page. What would you like to know?";
//   if(has('thank')) return "You're welcome! Good luck with your application — I'm here if you have more questions.";

//   return "I can help with eligibility, documents, or application steps for PMAY, Mudra Loan, Stand-Up India, and Sukanya Samriddhi Yojana. Could you tell me which scheme you mean?";
// }

async function sendMessage() {

    const val = chatInput.value.trim();

    if (!val) return;

    addMsg(val, "user");

    chatInput.value = "";

    try {

        const response = await fetch("http://127.0.0.1:8000/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: val
            })

        });

        const data = await response.json();

        addMsg(data.reply, "bot");

    }

    catch (error) {

        console.error(error);

        addMsg("Sorry, I couldn't connect to the AI assistant.", "bot");

    }

}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') sendMessage(); });

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chatInput.value = chip.dataset.q;
    sendMessage();
  });
});
