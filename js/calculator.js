/* Itemized detailing estimate, compatible services and add-ons. No backend or price guarantees. */
document.addEventListener('DOMContentLoaded', () => {
  const premiumIds = new Set(['premium','ultimate']);
  const main=MAB.services.filter(s=>typeof s.price==='number' && !premiumIds.has(s.id));
  const premium=MAB.services.filter(s=>premiumIds.has(s.id));
  const add=MAB.addons;
  const serviceContainer=document.getElementById('main-services'),addonsContainer=document.getElementById('addon-list'),vehicleContainer=document.getElementById('vehicle-options');
  const conditionInputs=[...document.querySelectorAll('input[name="condition"]')];
  const state={services:new Set(),addons:new Set(),size:'sedan',condition:'normal',premium:null};
  const sizeItems=[{id:'sedan',en:'Sedan / Coupe',es:'Sedán / Coupé',cost:0},{id:'suv',en:'SUV / Crossover',es:'SUV / Crossover',cost:15},{id:'large',en:'Large SUV / Truck / Van',es:'SUV grande / Pickup / Van',cost:30}];
  const param=new URLSearchParams(location.search).get('service');
  if(main.some(s=>s.id===param))state.services.add(param);
  if(premium.some(s=>s.id===param))state.premium=param;

  function hasPricedSelection(){return state.services.size>0 || !!state.premium;}
  function premiumScope(){return !!state.premium ? {hasExterior:true,hasInterior:true,hasDeep:true} : null;}
  // Basic work overlaps: Signature includes Super Wash and Exterior; Deep Interior includes the interior portion of Super Wash/Signature.
  // Exterior + Deep Interior is complementary and may be selected together.
  function compatible(id){if(state.premium)return false;if(!state.services.size)return true;if(state.services.has(id))return true;if(id==='exterior')return [...state.services].every(s=>s==='deep');if(id==='deep')return [...state.services].every(s=>s==='exterior');return false;}
  function scope(){
    const pScope = premiumScope();
    if(pScope) return pScope;
    let s=state.services;
    return {hasExterior:s.has('super')||s.has('exterior')||s.has('signature'),hasInterior:s.has('super')||s.has('signature')||s.has('deep'),hasDeep:s.has('deep')};
  }
  function addonAllowed(a){
    if(!hasPricedSelection()) return false;
    if(state.premium){
      // Premium and Ultimate already include clay bar treatment.
      if(a.id==='clay') return false;
      return true;
    }
    let sc=scope();
    return a.kind==='all'||(a.kind==='interior'&&sc.hasInterior)||(a.kind==='exterior'&&sc.hasExterior);
  }
  function drawVehicle(){vehicleContainer.replaceChildren();sizeItems.forEach(v=>{const label=document.createElement('label');label.className='vehicle-option';const input=document.createElement('input');input.type='radio';input.name='vehicle-size';input.value=v.id;input.checked=state.size===v.id;input.addEventListener('change',()=>{state.size=v.id;drawTotals()});let text=document.createElement('span');text.textContent=v[MAB.lang];let sub=document.createElement('small');sub.textContent='+'+MAB.fmt(v.cost);label.append(input,text,sub);vehicleContainer.append(label)})}
  function drawMain(){serviceContainer.replaceChildren();main.forEach(s=>{const label=document.createElement('label');label.className='option-card';const input=document.createElement('input');input.type='checkbox';input.checked=state.services.has(s.id);input.disabled=!compatible(s.id);input.value=s.id;input.addEventListener('change',()=>{if(input.checked){if(!compatible(s.id))return;state.services.add(s.id)}else state.services.delete(s.id);state.addons=new Set([...state.addons].filter(id=>{const a=add.find(x=>x.id===id);return a&&addonAllowed(a)}));normalizeCondition();renderAll();});let c=document.createElement('span');c.className='option-copy';let title=document.createElement('strong');title.textContent=s[MAB.lang];let desc=document.createElement('small');desc.textContent=MAB.lang==='es'?s.descEs:s.descEn;c.append(title,desc);if(input.disabled){let note=document.createElement('small');note.className='restriction';note.textContent=MAB.lang==='es'?'Incluido o incompatible con la selección actual.':'Already covered or overlaps your current selection.';c.appendChild(note)}const cost=document.createElement('span');cost.className='option-cost';cost.textContent=MAB.fmt(s.price);label.append(input,c,cost);serviceContainer.appendChild(label)})}
  function drawPremium(){
    const container=document.getElementById('premium-services');if(!container)return;
    const lang=MAB.lang;container.replaceChildren();
    premium.forEach(s=>{
      const label=document.createElement('label');label.className='option-card premium-option';
      const input=document.createElement('input');input.type='radio';input.name='premium-tier';input.value=s.id;input.checked=state.premium===s.id;
      const copy=document.createElement('span');copy.className='option-copy';
      const name=document.createElement('strong');name.textContent=s[lang];
      const desc=document.createElement('small');desc.textContent=lang==='es'?s.descEs:s.descEn;
      copy.append(name,desc);
      const price=document.createElement('span');price.className='option-cost premium-price';price.textContent=MAB.fmt(s.price);
      input.addEventListener('change',()=>{state.premium=s.id;state.services.clear();state.addons=new Set([...state.addons].filter(id=>{const a=add.find(x=>x.id===id);return a&&addonAllowed(a)}));normalizeCondition();renderAll()});
      label.append(input,copy,price);container.appendChild(label);
    });
    const clear=document.getElementById('clear-premium');if(clear){clear.hidden=!state.premium;clear.textContent=lang==='es'?'← Volver a precios regulares':'← Back to regular prices'}
  }
  function drawAddons(){addonsContainer.replaceChildren();const t=MAB.words[MAB.lang];if(!hasPricedSelection()){const p=document.createElement('p');p.className='muted-empty';p.textContent=t.noMain;addonsContainer.appendChild(p);return;}let count=0;add.forEach(a=>{if(!addonAllowed(a))return;count++;let l=document.createElement('label');l.className='option-card';let input=document.createElement('input');input.type='checkbox';input.checked=state.addons.has(a.id);input.addEventListener('change',()=>{if(input.checked)state.addons.add(a.id);else state.addons.delete(a.id);drawTotals()});let c=document.createElement('span');c.className='option-copy';let strong=document.createElement('strong');strong.textContent=a[MAB.lang];let sub=document.createElement('small');sub.textContent=MAB.lang==='es'?a.esDesc:a.enDesc;c.append(strong,sub);let cost=document.createElement('span');cost.className='option-cost';cost.textContent='+'+MAB.fmt(a.price);l.append(input,c,cost);addonsContainer.appendChild(l)});if(!count){const p=document.createElement('p');p.className='muted-empty';p.textContent=t.noExtras;addonsContainer.appendChild(p)}}
  function normalizeCondition(){const sc=scope();if(state.condition==='exterior'&&!sc.hasExterior||state.condition==='interior'&&!sc.hasDeep||state.condition==='both'&&!(sc.hasExterior&&sc.hasDeep)){state.condition='normal';}conditionInputs.forEach(inp=>{inp.disabled=inp.value==='exterior'&&!sc.hasExterior||inp.value==='interior'&&!sc.hasDeep||inp.value==='both'&&!(sc.hasExterior&&sc.hasDeep);inp.checked=inp.value===state.condition})}
  function currentLines(){const t=MAB.words[MAB.lang];const lines=[];const sz=sizeItems.find(v=>v.id===state.size).cost;
    if(state.premium){
      const s=premium.find(x=>x.id===state.premium);
      if(s){
        lines.push({name:s[MAB.lang],amount:s.price});
        if(sz) lines.push({name:t.sizeAdjustment+' · '+s[MAB.lang],amount:sz});
      }
    }
    [...state.services].forEach(id=>{const s=main.find(x=>x.id===id);if(s){lines.push({name:s[MAB.lang],amount:s.price});if(sz)lines.push({name:t.sizeAdjustment+' · '+s[MAB.lang],amount:sz});}});
    if(state.condition==='exterior'||state.condition==='both')lines.push({name:t.exteriorExtra,amount:25});
    if(state.condition==='interior'||state.condition==='both')lines.push({name:t.interiorExtra,amount:35});
    [...state.addons].forEach(id=>{const a=add.find(x=>x.id===id);if(a)lines.push({name:a[MAB.lang],amount:a.price})});
    return lines
  }
  function drawTotals(){const t=MAB.words[MAB.lang];const lines=currentLines();const list=document.getElementById('estimate-lines');list.replaceChildren();if(!lines.length){let p=document.createElement('p');p.className='est-note';p.textContent=t.estimateEmpty;list.appendChild(p)}else lines.forEach(item=>{let line=document.createElement('div');line.className='estimate-line';let name=document.createElement('span');name.textContent=item.name;let price=document.createElement('span');price.textContent=MAB.fmt(item.amount);line.append(name,price);list.appendChild(line)});const travel=document.createElement('div');travel.className='estimate-line';const travelName=document.createElement('span');travelName.textContent=t.travelFee;const travelPrice=document.createElement('span');travelPrice.textContent='$0';travel.append(travelName,travelPrice);if(lines.length)list.appendChild(travel);let total=lines.reduce((sum,i)=>sum+i.amount,0);document.getElementById('total-price').textContent=total?MAB.fmt(total)+(state.condition==='severe'?'+':''):'$0';document.getElementById('estimate-notice').textContent=state.condition==='severe'?t.severeWarning:(lines.length?t.normalNotice:'');document.getElementById('condition-info').textContent=state.condition==='severe'?t.severeWarning:'';}
  function renderAll(){drawMain();drawPremium();drawVehicle();drawAddons();drawTotals()}
  conditionInputs.forEach(inp=>inp.addEventListener('change',()=>{state.condition=inp.value;normalizeCondition();drawTotals()}));
  function message(){let lang=MAB.lang,t=MAB.words[lang],name=document.getElementById('customer-name').value.trim(),year=document.getElementById('vehicle-year').value.trim(),make=document.getElementById('vehicle-make').value.trim(),model=document.getElementById('vehicle-model').value.trim(),zip=document.getElementById('zip-code').value.trim();const lines=currentLines();const total=lines.reduce((sum,l)=>sum+l.amount,0);const note=document.getElementById('condition-description').value.trim();const messageLines=[t.quoteTextStart,'',t.customerLabel+': '+name,t.vehicleLabel+': '+year+' '+make+' '+model+' ('+sizeItems.find(x=>x.id===state.size)[lang]+')',t.zipLabel+': '+zip,'',...lines.map(l=>'- '+l.name+': '+MAB.fmt(l.amount)), '- '+t.travelFee+': $0','',t.estimatedTotal+': '+MAB.fmt(total)+(state.condition==='severe'?'+':'')];if(state.condition==='severe')messageLines.push(t.severeLabel);if(note)messageLines.push(t.conditionDescription+': '+note);messageLines.push('',state.condition==='severe'?t.notFinal:t.estimateFootnote);return messageLines.join('\n')}
  function send(channel){const error=document.getElementById('send-error'),t=MAB.words[MAB.lang];error.hidden=true;document.getElementById('service-error').hidden=true;if(!state.services.size&&!state.premium){error.textContent=t.selectRequired;error.hidden=false;document.getElementById('service-error').textContent=t.selectRequired;document.getElementById('service-error').hidden=false;document.getElementById('main-services').scrollIntoView({block:'center',behavior:'smooth'});return;}const required=['customer-name','vehicle-year','vehicle-make','vehicle-model','zip-code'];const valid=required.every(id=>document.getElementById(id).checkValidity());if(!valid){error.textContent=t.fillFields;error.hidden=false;const first=required.map(id=>document.getElementById(id)).find(el=>!el.checkValidity());if(first)first.focus();return;}const dest=channel==='wa'?MAB.waUrl(message()):MAB.smsUrl(message());window.location.href=dest;}
  document.getElementById('clear-premium').addEventListener('click',()=>{state.premium=null;state.addons.clear();normalizeCondition();renderAll()});
  const boatButton=document.getElementById('boat-quote-button'),marineSelect=document.getElementById('marine-service');
  const marineServices=MAB.services.filter(s=>s.cat==='marine');
  function refreshMarine(){if(!marineSelect)return;const previous=marineSelect.value;marineSelect.replaceChildren();marineServices.forEach(s=>marineSelect.add(new Option(s[MAB.lang],s.id)));if(marineServices.some(s=>s.id===previous))marineSelect.value=previous;else if(marineServices[0]) marineSelect.value=marineServices[0].id;}
  function marineMessage(){const chosen=marineServices.find(s=>s.id===marineSelect.value)||marineServices[0];return (MAB.lang==='es'?'¡Hola! Quisiera solicitar una cotización para: ':'Hi! I would like a personalized quote for: ')+chosen[MAB.lang]+'. '+MAB.words[MAB.lang].marineDetails;}
  if(boatButton)boatButton.addEventListener('click',()=>{window.location.href=MAB.waUrl(marineMessage())});
  MAB.onLanguage(refreshMarine);refreshMarine();
  document.getElementById('send-whatsapp').addEventListener('click',()=>send('wa'));
  document.getElementById('send-sms').addEventListener('click',()=>send('sms'));
  MAB.onLanguage(()=>{normalizeCondition();renderAll()});
  normalizeCondition();renderAll();
});
