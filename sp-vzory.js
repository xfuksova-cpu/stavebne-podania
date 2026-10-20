/*! Stavebne podania - vzory podla noveho stavebneho zakona | stavebnyportal.sk | v1.0.0 */
(function(){'use strict';
const LAW = 'z\u00e1kona \u010d. 25/2025 Z. z. Stavebn\u00fd z\u00e1kon a o zmene a doplnen\u00ed niektor\u00fdch z\u00e1konov (\u010falej len \u201estavebn\u00fd z\u00e1kon\u201c)';

/* Spolo\u010dn\u00e9 skupiny pol\u00ed \u2013 zdie\u013eaj\u00fa sa medzi v\u0161etk\u00fdmi vzormi */
const GROUPS = {
  urad:{t:'Stavebn\u00fd \u00farad', f:[
    {id:'urad_nazov',l:'N\u00e1zov stavebn\u00e9ho \u00faradu'},
    {id:'urad_adresa',l:'Adresa \u00faradu',ta:1}]},
  stavebnik:{t:'Stavebn\u00edk / \u017eiadate\u013e', f:[
    {id:'st_meno',l:'Meno a priezvisko / obchodn\u00e9 meno'},
    {id:'st_adresa',l:'Trval\u00fd pobyt / s\u00eddlo'},
    {id:'st_id',l:'D\u00e1tum narodenia / I\u010cO'},
    {id:'st_tel',l:'Telef\u00f3n'},
    {id:'st_email',l:'E-mail'}]},
  zastupca:{t:'Splnomocnen\u00fd z\u00e1stupca',o:'nepovinn\u00e9', f:[
    {id:'zs_meno',l:'Meno a priezvisko / n\u00e1zov'},
    {id:'zs_adresa',l:'Adresa'}]},
  stavba:{t:'Stavba a pozemky', f:[
    {id:'sb_nazov',l:'N\u00e1zov stavby'},
    {id:'sb_ucel',l:'Druh a \u00fa\u010del stavby'},
    {id:'sb_obec',l:'Obec, ulica, s\u00fapisn\u00e9 \u010d\u00edslo'},
    {id:'sb_ku',l:'Katastr\u00e1lne \u00fazemie'},
    {id:'sb_parc',l:'Parceln\u00e9 \u010d\u00edsla (register C KN)'},
    {id:'sb_lv',l:'List vlastn\u00edctva \u010d.'}]},
  projektant:{t:'Projektant', f:[
    {id:'pr_meno',l:'Meno a priezvisko / n\u00e1zov'},
    {id:'pr_reg',l:'Registra\u010dn\u00e9 \u010d\u00edslo opr\u00e1vnenia'}]},
  podpis:{t:'Miesto a d\u00e1tum', f:[
    {id:'miesto',l:'Miesto'},
    {id:'datum',l:'D\u00e1tum',type:'date'}]}
};

const SAMPLE = {
  urad_nazov:'\u00darad pre \u00fazemn\u00e9 pl\u00e1novanie a v\u00fdstavbu Slovenskej republiky, pracovisko \u017dilina',
  urad_adresa:'N\u00e1mestie obet\u00ed komunizmu 1\n011 31 \u017dilina',
  st_meno:'J\u00e1n Vzorov\u00fd', st_adresa:'Lipov\u00e1 12, 010 01 \u017dilina', st_id:'14. 3. 1984',
  st_tel:'+421 900 123 456', st_email:'jan.vzorovy@example.sk',
  sb_nazov:'Rodinn\u00fd dom Vzorov\u00fd', sb_ucel:'rodinn\u00fd dom \u2013 b\u00fdvanie, 1 byt',
  sb_obec:'\u017dilina, ulica Pod H\u00e1jom', sb_ku:'B\u00e1nov\u00e1', sb_parc:'1234/5, 1234/6', sb_lv:'2589',
  pr_meno:'Ing. arch. Eva Projektov\u00e1', pr_reg:'1234 AA',
  miesto:'\u017diline'
};

const PRIL = {
  pravo:'Doklad o vlastn\u00edckom alebo inom pr\u00e1ve k pozemku (list vlastn\u00edctva, zmluva) \u2013 ak nie je overite\u013en\u00fd z katastra',
  splno:'Splnomocnenie na zastupovanie (ak sa stavebn\u00edk d\u00e1va zastupova\u0165)',
  poplatok:'Doklad o zaplaten\u00ed spr\u00e1vneho poplatku',
  zs:'Z\u00e1v\u00e4zn\u00e9 stanovisk\u00e1 dotknut\u00fdch org\u00e1nov',
  vyj:'Vyjadrenia dotknut\u00fdch os\u00f4b (spr\u00e1vcovia siet\u00ed a pod.)',
  ucast:'Zoznam \u00fa\u010dastn\u00edkov konania \u2013 vlastn\u00edci susedn\u00fdch pozemkov a stavieb'
};

const CATS = ['Pr\u00edprava stavby','Povolenie stavby','V\u00fdstavba','Kolaud\u00e1cia a u\u017e\u00edvanie','Odstr\u00e1nenie a legaliz\u00e1cia','Konanie, s\u00fahlasy a vyhl\u00e1senia'];

/* Helpery pre text listu */
const T = rows => '<table>'+rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')+'</table>';
const P = s => `<p>${s}</p>`;

/* Katal\u00f3g vzorov */
const TPL = [
/* ---------- Pr\u00edprava ---------- */
{id:'zavazne-stanovisko',c:0,t:'\u017diados\u0165 o z\u00e1v\u00e4zn\u00e9 stanovisko dotknut\u00e9ho org\u00e1nu',
 d:'K stavebn\u00e9mu z\u00e1meru, projektu stavby alebo ku kolaud\u00e1cii.',
 g:['stavebnik','zastupca','stavba','projektant'],
 rcp:['org_nazov','org_adresa'],
 x:[{id:'org_nazov',l:'Dotknut\u00fd org\u00e1n (adres\u00e1t)',ph:'napr. Okresn\u00fd \u00farad \u017dilina, odbor starostlivosti o \u017eivotn\u00e9 prostredie'},
    {id:'org_adresa',l:'Adresa dotknut\u00e9ho org\u00e1nu',ta:1},
    {id:'faza',l:'Na \u00fa\u010dely',sel:['rozhodnutia o stavebnom z\u00e1mere','overenia projektu stavby','kolaud\u00e1cie stavby','ohl\u00e1senia stavby','zmeny stavby pred dokon\u010den\u00edm']},
    {id:'zaujem',l:'Chr\u00e1nen\u00fd verejn\u00fd z\u00e1ujem / oblas\u0165',ph:'napr. ochrana v\u00f4d, ochrana pr\u00edrody, po\u017eiarna ochrana, cestn\u00e1 doprava'}],
 p:['Dokument\u00e1cia stavby (stavebn\u00fd z\u00e1mer / projekt stavby) v rozsahu potrebnom na pos\u00fadenie',PRIL.splno],
 s:'\u017diados\u0165 o vydanie z\u00e1v\u00e4zn\u00e9ho stanoviska',
 b:f=>P(`Ako stavebn\u00edk V\u00e1s \u017eiadam o vydanie z\u00e1v\u00e4zn\u00e9ho stanoviska pod\u013ea ${LAW} na \u00fa\u010dely ${f('faza')} k ni\u017e\u0161ie uvedenej stavbe, a to z h\u013eadiska verejn\u00e9ho z\u00e1ujmu, ktor\u00fd chr\u00e1nite: ${f('zaujem')}.`)+
   T([['N\u00e1zov stavby',f('sb_nazov')],['Druh a \u00fa\u010del stavby',f('sb_ucel')],['Miesto stavby',f('sb_obec')],['Katastr\u00e1lne \u00fazemie',f('sb_ku')],['Parcely',f('sb_parc')],['Projektant',f('pr_meno')+', reg. \u010d. '+f('pr_reg')]])+
   P('Z\u00e1v\u00e4zn\u00e9 stanovisko pros\u00edm doru\u010di\u0165 na adresu stavebn\u00edka, pr\u00edpadne elektronicky na uveden\u00fd e-mail.')},

{id:'vyjadrenie-siete',c:0,t:'\u017diados\u0165 o vyjadrenie spr\u00e1vcu siet\u00ed',
 d:'Vyjadrenie dotknutej osoby k existencii siet\u00ed a k pripojeniu stavby.',
 g:['stavebnik','stavba','projektant'],
 rcp:['org_nazov','org_adresa'],
 x:[{id:'org_nazov',l:'Spr\u00e1vca siete (adres\u00e1t)',ph:'napr. vod\u00e1rensk\u00e1 spolo\u010dnos\u0165, distrib\u00fator elektriny, plynu'},
    {id:'org_adresa',l:'Adresa spr\u00e1vcu',ta:1},
    {id:'siet',l:'Druh siete',sel:['vodovod','kanaliz\u00e1cia','elektrina (NN/VN)','plyn','telekomunika\u010dn\u00e9 siete','teplo','v\u0161etky siete v spr\u00e1ve adres\u00e1ta']},
    {id:'ucel_vyj',l:'\u017diadam o',sel:['vyjadrenie k existencii siet\u00ed v \u00fazem\u00ed','vyjadrenie k pripojeniu stavby','vyjadrenie k existencii siet\u00ed aj k pripojeniu stavby']},
    {id:'potreba',l:'Predpokladan\u00e1 potreba / pr\u00edkon',ph:'napr. 3\u00d725 A; 0,05 l/s'}],
 p:['Situ\u00e1cia so zakreslen\u00edm stavby a navrhovanej pr\u00edpojky','K\u00f3pia z katastr\u00e1lnej mapy'],
 s:'\u017diados\u0165 o vyjadrenie k stavbe',
 b:f=>P(`Pre potreby pr\u00edpravy stavby pod\u013ea ${LAW} V\u00e1s \u017eiadam o ${f('ucel_vyj')} \u2013 druh siete: ${f('siet')}.`)+
   T([['N\u00e1zov stavby',f('sb_nazov')],['Miesto stavby',f('sb_obec')],['Katastr\u00e1lne \u00fazemie / parcely',f('sb_ku')+', parc. \u010d. '+f('sb_parc')],['Predpokladan\u00e1 potreba',f('potreba')],['Projektant',f('pr_meno')]])+
   P('Vyjadrenie bude s\u00fa\u010das\u0165ou dokument\u00e1cie k \u017eiadosti o rozhodnutie o stavebnom z\u00e1mere.')},

{id:'suhlas-suseda',c:0,t:'S\u00fahlas vlastn\u00edka susedn\u00e9ho pozemku',
 d:'S\u00fahlas suseda so stavbou, jej umiestnen\u00edm alebo vstupom na pozemok.',
 g:['stavebnik','stavba'], nosender:1, signer:'sused_meno',
 x:[{id:'sused_meno',l:'Sused \u2013 meno a priezvisko'},
    {id:'sused_adresa',l:'Sused \u2013 trval\u00fd pobyt'},
    {id:'sused_nar',l:'Sused \u2013 d\u00e1tum narodenia'},
    {id:'sused_parc',l:'Susedn\u00fd pozemok \u2013 parc. \u010d. a k. \u00fa.'},
    {id:'sused_lv',l:'Susedn\u00fd pozemok \u2013 LV \u010d.'},
    {id:'odstup',l:'Vzdialenos\u0165 stavby od spolo\u010dnej hranice',ph:'napr. 2,0 m'},
    {id:'podm',l:'Podmienky s\u00fahlasu (nepovinn\u00e9)',ta:1}],
 p:['Situ\u00e1cia stavby podp\u00edsan\u00e1 vlastn\u00edkom susedn\u00e9ho pozemku'],
 title:'S\u00fahlas vlastn\u00edka susedn\u00e9ho pozemku',
 b:f=>P(`Dolupodp\u00edsan\u00fd/\u00e1 ${f('sused_meno')}, nar. ${f('sused_nar')}, bytom ${f('sused_adresa')}, ako vlastn\u00edk pozemku parc. \u010d. ${f('sused_parc')}, zap\u00edsan\u00e9ho na LV \u010d. ${f('sused_lv')},`)+
   P(`<b>s\u00fahlas\u00edm</b> s uskuto\u010dnen\u00edm stavby \u201e${f('sb_nazov')}\u201c stavebn\u00edka ${f('st_meno')}, bytom ${f('st_adresa')}, na pozemku parc. \u010d. ${f('sb_parc')}, k. \u00fa. ${f('sb_ku')}, vo vzdialenosti ${f('odstup')} od spolo\u010dnej hranice pozemkov, pod\u013ea prilo\u017eenej situ\u00e1cie, ktor\u00fa som podp\u00edsal/a.`)+
   P(`Podmienky s\u00fahlasu: ${f('podm','bez podmienok')}.`)+
   P('S\u00fahlas ude\u013eujem slobodne a v\u00e1\u017ene, nie v tiesni ani za n\u00e1padne nev\u00fdhodn\u00fdch podmienok.')},

{id:'suhlas-vlastnika',c:0,t:'S\u00fahlas vlastn\u00edka pozemku so stavbou',
 d:'Ke\u010f stavebn\u00edk nie je vlastn\u00edkom pozemku (in\u00e9 pr\u00e1vo k pozemku).',
 g:['stavebnik','stavba'], nosender:1, signer:'vl_meno',
 x:[{id:'vl_meno',l:'Vlastn\u00edk \u2013 meno a priezvisko / n\u00e1zov'},
    {id:'vl_adresa',l:'Vlastn\u00edk \u2013 trval\u00fd pobyt / s\u00eddlo'},
    {id:'vl_nar',l:'Vlastn\u00edk \u2013 d\u00e1tum narodenia / I\u010cO'},
    {id:'vl_podiel',l:'Spoluvlastn\u00edcky podiel',ph:'napr. 1/1'}],
 p:['List vlastn\u00edctva'],
 title:'S\u00fahlas vlastn\u00edka pozemku s uskuto\u010dnen\u00edm stavby',
 b:f=>P(`Dolupodp\u00edsan\u00fd/\u00e1 ${f('vl_meno')}, nar./I\u010cO ${f('vl_nar')}, bytom/s\u00eddlo ${f('vl_adresa')}, ako vlastn\u00edk (podiel ${f('vl_podiel')}) pozemkov parc. \u010d. ${f('sb_parc')}, k. \u00fa. ${f('sb_ku')}, zap\u00edsan\u00fdch na LV \u010d. ${f('sb_lv')},`)+
   P(`<b>s\u00fahlas\u00edm</b>, aby stavebn\u00edk ${f('st_meno')}, nar./I\u010cO ${f('st_id')}, bytom/s\u00eddlo ${f('st_adresa')}, uskuto\u010dnil na uveden\u00fdch pozemkoch stavbu \u201e${f('sb_nazov')}\u201c (${f('sb_ucel')}).`)+
   P('Tento s\u00fahlas predstavuje in\u00e9 pr\u00e1vo k pozemku na \u00fa\u010dely konan\u00ed pod\u013ea stavebn\u00e9ho z\u00e1kona.')},

/* ---------- Povolenie ---------- */
{id:'stavebny-zamer',c:1,t:'\u017diados\u0165 o vydanie rozhodnutia o stavebnom z\u00e1mere',
 d:'Z\u00e1kladn\u00e9 povolenie stavby pod\u013ea nov\u00e9ho z\u00e1kona (nahr\u00e1dza \u00fazemn\u00e9 a stavebn\u00e9 konanie).',
 g:['urad','stavebnik','zastupca','stavba','projektant'],
 x:[{id:'druh',l:'Druh stavby',sel:['novostavba','zmena dokon\u010denej stavby \u2013 pr\u00edstavba','zmena dokon\u010denej stavby \u2013 nadstavba','zmena dokon\u010denej stavby \u2013 stavebn\u00e9 \u00fapravy']},
    {id:'trvanie',l:'Trvanie stavby',sel:['trval\u00e1','do\u010dasn\u00e1']},
    {id:'zast',l:'Zastavan\u00e1 plocha (m\u00b2)'},
    {id:'podl',l:'Po\u010det podla\u017e\u00ed'},
    {id:'siete',l:'Napojenie na siete a komunik\u00e1cie',ta:1,ph:'vodovod, kanaliz\u00e1cia/\u017dSV, elektrina, plyn, pr\u00edjazd z MK \u2026'},
    {id:'sposob',l:'Sp\u00f4sob uskuto\u010dnenia',sel:['zhotovite\u013eom','svojpomocou za stavebn\u00e9ho dozoru']},
    {id:'lehota',l:'Predpokladan\u00e1 lehota v\u00fdstavby',ph:'napr. 24 mesiacov'}],
 p:['Dokument\u00e1cia stavebn\u00e9ho z\u00e1meru vypracovan\u00e1 opr\u00e1vnenou osobou',PRIL.pravo,PRIL.zs,PRIL.vyj,PRIL.ucast,PRIL.splno,PRIL.poplatok],
 s:'\u017diados\u0165 o vydanie rozhodnutia o stavebnom z\u00e1mere',
 b:f=>P(`Pod\u013ea ${LAW} \u017eiadam o vydanie rozhodnutia o stavebnom z\u00e1mere pre stavbu:`)+
   T([['N\u00e1zov stavby',f('sb_nazov')],['Druh stavby',f('druh')],['\u00da\u010del stavby',f('sb_ucel')],['Trvanie stavby',f('trvanie')],['Miesto stavby',f('sb_obec')],['Katastr\u00e1lne \u00fazemie',f('sb_ku')],['Parcely (reg. C KN)',f('sb_parc')+'; LV \u010d. '+f('sb_lv')],['Zastavan\u00e1 plocha / podla\u017eia',f('zast')+' m\u00b2, '+f('podl')+' podl.'],['Napojenie na siete',f('siete')],['Projektant',f('pr_meno')+', reg. \u010d. '+f('pr_reg')],['Sp\u00f4sob uskuto\u010dnenia',f('sposob')],['Lehota v\u00fdstavby',f('lehota')]])+
   P('Vyhlasujem, \u017ee \u00fadaje uveden\u00e9 v \u017eiadosti a v prilo\u017eenej dokument\u00e1cii s\u00fa pravdiv\u00e9 a \u00fapln\u00e9.')},

{id:'overenie-projektu',c:1,t:'\u017diados\u0165 o overenie projektu stavby',
 d:'Po pr\u00e1voplatnom rozhodnut\u00ed o stavebnom z\u00e1mere, pred za\u010dat\u00edm v\u00fdstavby.',
 g:['urad','stavebnik','zastupca','stavba','projektant'],
 x:[{id:'rozh_c',l:'Rozhodnutie o stavebnom z\u00e1mere \u010d.'},
    {id:'rozh_d',l:'zo d\u0148a',type:'date'},
    {id:'rozh_pr',l:'pr\u00e1voplatn\u00e9 d\u0148a',type:'date'}],
 p:['Projekt stavby vypracovan\u00fd opr\u00e1vnenou osobou','Z\u00e1v\u00e4zn\u00e9 stanovisk\u00e1 dotknut\u00fdch org\u00e1nov k projektu stavby',PRIL.splno,PRIL.poplatok],
 s:'\u017diados\u0165 o overenie projektu stavby',
 b:f=>P(`Pod\u013ea ${LAW} \u017eiadam o overenie projektu stavby \u201e${f('sb_nazov')}\u201c na pozemkoch parc. \u010d. ${f('sb_parc')}, k. \u00fa. ${f('sb_ku')}.`)+
   P(`Stavebn\u00fd z\u00e1mer bol povolen\u00fd rozhodnut\u00edm \u010d. ${f('rozh_c')} zo d\u0148a ${f('rozh_d')}, ktor\u00e9 nadobudlo pr\u00e1voplatnos\u0165 d\u0148a ${f('rozh_pr')}.`)+
   P(`Projekt stavby vypracoval/a ${f('pr_meno')}, reg. \u010d. ${f('pr_reg')}, a je v s\u00falade s rozhodnut\u00edm o stavebnom z\u00e1mere a jeho podmienkami.`)},

{id:'ohlasenie',c:1,t:'Ohl\u00e1senie stavby',
 d:'Drobn\u00e1 stavba, stavebn\u00e9 \u00fapravy, udr\u017eiavacie pr\u00e1ce a in\u00e9 ohlasovan\u00e9 stavby.',
 g:['urad','stavebnik','zastupca','stavba'],
 x:[{id:'ohl_typ',l:'Predmet ohl\u00e1senia',sel:['drobn\u00e1 stavba','stavebn\u00e9 \u00fapravy','udr\u017eiavacie pr\u00e1ce','zmena dokon\u010denej stavby v rozsahu ohl\u00e1senia','ter\u00e9nne \u00fapravy','reklamn\u00e1 stavba']},
    {id:'popis',l:'Stru\u010dn\u00fd popis a rozsah pr\u00e1c',ta:1,ph:'napr. z\u00e1hradn\u00fd sklad 4\u00d75 m, v\u00fd\u0161ka 3 m, dreven\u00e1 kon\u0161trukcia'},
    {id:'zast',l:'Zastavan\u00e1 plocha (m\u00b2)'},
    {id:'vyska',l:'V\u00fd\u0161ka (m)'},
    {id:'sposob',l:'Sp\u00f4sob uskuto\u010dnenia',sel:['svojpomocou za stavebn\u00e9ho dozoru','zhotovite\u013eom']},
    {id:'dozor',l:'Stavebn\u00fd dozor / zhotovite\u013e',ph:'meno, reg. \u010d. / obchodn\u00e9 meno, I\u010cO'},
    {id:'zac',l:'Predpokladan\u00fd za\u010diatok',type:'date'},
    {id:'kon',l:'Predpokladan\u00e9 dokon\u010denie',type:'date'}],
 p:['Jednoduch\u00fd situa\u010dn\u00fd v\u00fdkres s vyzna\u010den\u00edm umiestnenia stavby a odstupov','Jednoduch\u00fd technick\u00fd opis stavby',PRIL.pravo,'S\u00fahlas vlastn\u00edkov susedn\u00fdch pozemkov (ak sa vy\u017eaduje)',PRIL.zs,'Vyhl\u00e1senie stavebn\u00e9ho dozoru (pri svojpomoci)',PRIL.poplatok],
 s:'Ohl\u00e1senie stavby',
 b:f=>P(`Pod\u013ea ${LAW} ohlasujem stavebn\u00e9mu \u00faradu ${f('ohl_typ')}:`)+
   T([['N\u00e1zov stavby / pr\u00e1c',f('sb_nazov')],['\u00da\u010del',f('sb_ucel')],['Popis a rozsah',f('popis')],['Zastavan\u00e1 plocha / v\u00fd\u0161ka',f('zast')+' m\u00b2 / '+f('vyska')+' m'],['Miesto',f('sb_obec')],['K. \u00fa. / parcely / LV',f('sb_ku')+' / '+f('sb_parc')+' / '+f('sb_lv')],['Sp\u00f4sob uskuto\u010dnenia',f('sposob')],['Stavebn\u00fd dozor / zhotovite\u013e',f('dozor')],['Za\u010diatok \u2013 dokon\u010denie',f('zac')+' \u2013 '+f('kon')]])+
   P('\u017diadam o vydanie osved\u010denia o ohl\u00e1sen\u00ed stavby. Vyhlasujem, \u017ee stavba svoj\u00edm rozsahom sp\u013a\u0148a podmienky pre ohl\u00e1senie.')},

{id:'zmena-pred-dokoncenim',c:1,t:'\u017diados\u0165 o zmenu stavby pred dokon\u010den\u00edm',
 d:'Zmena oproti povolen\u00e9mu stavebn\u00e9mu z\u00e1meru alebo overen\u00e9mu projektu.',
 g:['urad','stavebnik','zastupca','stavba','projektant'],
 x:[{id:'rozh_c',l:'Rozhodnutie o stavebnom z\u00e1mere \u010d.'},
    {id:'rozh_d',l:'zo d\u0148a',type:'date'},
    {id:'zmena',l:'Popis navrhovanej zmeny',ta:1},
    {id:'dovod',l:'D\u00f4vod zmeny',ta:1}],
 p:['Dokument\u00e1cia zmeny stavby s vyzna\u010den\u00edm zmien',PRIL.zs,PRIL.splno,PRIL.poplatok],
 s:'\u017diados\u0165 o povolenie zmeny stavby pred dokon\u010den\u00edm',
 b:f=>P(`Pod\u013ea ${LAW} \u017eiadam o povolenie zmeny stavby \u201e${f('sb_nazov')}\u201c pred jej dokon\u010den\u00edm. Stavba bola povolen\u00e1 rozhodnut\u00edm \u010d. ${f('rozh_c')} zo d\u0148a ${f('rozh_d')}.`)+
   T([['Popis zmeny',f('zmena')],['D\u00f4vod zmeny',f('dovod')],['Miesto stavby',f('sb_obec')+', k. \u00fa. '+f('sb_ku')+', parc. \u010d. '+f('sb_parc')],['Projektant zmeny',f('pr_meno')+', reg. \u010d. '+f('pr_reg')]])},

{id:'predlzenie-platnosti',c:1,t:'\u017diados\u0165 o pred\u013a\u017eenie platnosti rozhodnutia o stavebnom z\u00e1mere',
 d:'Pod\u00e1va sa pred uplynut\u00edm platnosti rozhodnutia.',
 g:['urad','stavebnik','zastupca','stavba'],
 x:[{id:'rozh_c',l:'Rozhodnutie \u010d.'},
    {id:'rozh_d',l:'zo d\u0148a',type:'date'},
    {id:'rozh_pr',l:'pr\u00e1voplatn\u00e9 d\u0148a',type:'date'},
    {id:'nova',l:'Navrhovan\u00e1 doba pred\u013a\u017eenia',ph:'napr. o 2 roky'},
    {id:'dovod',l:'D\u00f4vod \u017eiadosti',ta:1}],
 p:[PRIL.splno,PRIL.poplatok],
 s:'\u017diados\u0165 o pred\u013a\u017eenie platnosti rozhodnutia o stavebnom z\u00e1mere',
 b:f=>P(`Pod\u013ea ${LAW} \u017eiadam o pred\u013a\u017eenie platnosti rozhodnutia o stavebnom z\u00e1mere \u010d. ${f('rozh_c')} zo d\u0148a ${f('rozh_d')}, pr\u00e1voplatn\u00e9ho d\u0148a ${f('rozh_pr')}, pre stavbu \u201e${f('sb_nazov')}\u201c, ${f('nova')}.`)+
   P(`Od\u00f4vodnenie: ${f('dovod')}`)+
   P('\u017diados\u0165 pod\u00e1vam pred uplynut\u00edm platnosti rozhodnutia.')},

/* ---------- V\u00fdstavba ---------- */
{id:'zaciatok-vystavby',c:2,t:'Ozn\u00e1menie o za\u010dat\u00ed v\u00fdstavby',
 d:'Ozn\u00e1menie term\u00ednu za\u010datia, zhotovite\u013ea a stavbyved\u00faceho / stavebn\u00e9ho dozoru.',
 g:['urad','stavebnik','stavba'],
 x:[{id:'rozh_c',l:'Povolenie (rozhodnutie / overen\u00fd projekt / osved\u010denie) \u010d.'},
    {id:'zac',l:'D\u00e1tum za\u010datia v\u00fdstavby',type:'date'},
    {id:'zhot',l:'Zhotovite\u013e (obchodn\u00e9 meno, I\u010cO, s\u00eddlo)',ph:'alebo \u201esvojpomoc\u201c'},
    {id:'sv',l:'Stavbyved\u00faci (meno, reg. \u010d.)'},
    {id:'dozor',l:'Stavebn\u00fd dozor (meno, reg. \u010d.)'}],
 p:['Vyhl\u00e1senie stavbyved\u00faceho / stavebn\u00e9ho dozoru o prevzat\u00ed funkcie'],
 s:'Ozn\u00e1menie o za\u010dat\u00ed v\u00fdstavby',
 b:f=>P(`Pod\u013ea ${LAW} oznamujem, \u017ee d\u0148a ${f('zac')} za\u010dnem v\u00fdstavbu stavby \u201e${f('sb_nazov')}\u201c, povolenej pod \u010d. ${f('rozh_c')}, na pozemkoch parc. \u010d. ${f('sb_parc')}, k. \u00fa. ${f('sb_ku')}.`)+
   T([['Zhotovite\u013e',f('zhot')],['Stavbyved\u00faci',f('sv')],['Stavebn\u00fd dozor',f('dozor')]])},

{id:'zmena-zhotovitela',c:2,t:'Ozn\u00e1menie zmeny zhotovite\u013ea alebo stavbyved\u00faceho',
 d:'Zmena os\u00f4b zodpovedn\u00fdch za uskuto\u010d\u0148ovanie stavby po\u010das v\u00fdstavby.',
 g:['urad','stavebnik','stavba'],
 x:[{id:'rozh_c',l:'Povolenie \u010d.'},
    {id:'co',l:'Men\u00ed sa',sel:['zhotovite\u013e','stavbyved\u00faci','stavebn\u00fd dozor','sp\u00f4sob uskuto\u010dnenia (svojpomoc \u2192 zhotovite\u013e)']},
    {id:'povodny',l:'P\u00f4vodn\u00e1 osoba'},
    {id:'novy',l:'Nov\u00e1 osoba (meno/n\u00e1zov, I\u010cO/reg. \u010d., adresa)'},
    {id:'odkedy',l:'\u00da\u010dinnos\u0165 zmeny od',type:'date'}],
 p:['Vyhl\u00e1senie novej osoby o prevzat\u00ed funkcie'],
 s:'Ozn\u00e1menie zmeny po\u010das uskuto\u010d\u0148ovania stavby',
 b:f=>P(`Oznamujem, \u017ee pri stavbe \u201e${f('sb_nazov')}\u201c, povolenej pod \u010d. ${f('rozh_c')}, doch\u00e1dza s \u00fa\u010dinnos\u0165ou od ${f('odkedy')} k zmene: ${f('co')}.`)+
   T([['P\u00f4vodne',f('povodny')],['Novo',f('novy')]])},

{id:'vyhlasenie-dozoru',c:2,t:'Vyhl\u00e1senie stavebn\u00e9ho dozoru / stavbyved\u00faceho',
 d:'Prevzatie funkcie pri stavbe uskuto\u010d\u0148ovanej svojpomocou alebo zhotovite\u013eom.',
 g:['stavebnik','stavba'], nosender:1, signer:'dz_meno',
 x:[{id:'dz_rola',l:'Funkcia',sel:['stavebn\u00fd dozor','stavbyved\u00faci']},
    {id:'dz_meno',l:'Meno a priezvisko'},
    {id:'dz_adresa',l:'Adresa'},
    {id:'dz_reg',l:'Registra\u010dn\u00e9 \u010d\u00edslo / opr\u00e1vnenie'},
    {id:'dz_tel',l:'Telef\u00f3n'}],
 p:['K\u00f3pia opr\u00e1vnenia (osved\u010denia o odbornej sp\u00f4sobilosti)'],
 title:'Vyhl\u00e1senie',
 b:f=>P(`Dolupodp\u00edsan\u00fd/\u00e1 ${f('dz_meno')}, bytom ${f('dz_adresa')}, reg. \u010d. ${f('dz_reg')}, tel. ${f('dz_tel')},`)+
   P(`vyhlasujem, \u017ee pri stavbe \u201e${f('sb_nazov')}\u201c na pozemkoch parc. \u010d. ${f('sb_parc')}, k. \u00fa. ${f('sb_ku')}, stavebn\u00edka ${f('st_meno')}, bytom ${f('st_adresa')}, <b>preber\u00e1m funkciu: ${f('dz_rola')}</b>, a budem ju vykon\u00e1va\u0165 v s\u00falade so stavebn\u00fdm z\u00e1konom a podmienkami povolenia.`)},

/* ---------- Kolaud\u00e1cia ---------- */
{id:'kolaudacia',c:3,t:'\u017diados\u0165 o kolaud\u00e1ciu stavby',
 d:'N\u00e1vrh na kolaud\u00e1ciu dokon\u010denej stavby (kolauda\u010dn\u00e9 osved\u010denie).',
 g:['urad','stavebnik','zastupca','stavba'],
 x:[{id:'rozh_c',l:'Rozhodnutie o stavebnom z\u00e1mere \u010d.'},
    {id:'over_c',l:'Overen\u00fd projekt stavby \u010d.'},
    {id:'dok',l:'D\u00e1tum dokon\u010denia stavby',type:'date'},
    {id:'odch',l:'Odch\u00fdlky od overen\u00e9ho projektu',ta:1,ph:'alebo \u201ebez odch\u00fdlok\u201c'},
    {id:'sv',l:'Stavbyved\u00faci / stavebn\u00fd dozor'}],
 p:['Geometrick\u00fd pl\u00e1n / porealiza\u010dn\u00e9 zameranie stavby','Doklady o overen\u00ed po\u017eadovan\u00fdch vlastnost\u00ed v\u00fdrobkov','Rev\u00edzne spr\u00e1vy (elektroin\u0161tal\u00e1cia, bleskozvod, plyn, kom\u00edn)','Energetick\u00fd certifik\u00e1t budovy','Z\u00e1vere\u010dn\u00e9 stanovisk\u00e1 dotknut\u00fdch org\u00e1nov','Stavebn\u00fd denn\u00edk','Vyhl\u00e1senie stavbyved\u00faceho / stavebn\u00e9ho dozoru o sp\u00f4sobilosti stavby na u\u017e\u00edvanie',PRIL.poplatok],
 s:'\u017diados\u0165 o kolaud\u00e1ciu stavby',
 b:f=>P(`Pod\u013ea ${LAW} \u017eiadam o kolaud\u00e1ciu stavby a vydanie kolauda\u010dn\u00e9ho osved\u010denia:`)+
   T([['N\u00e1zov stavby',f('sb_nazov')],['\u00da\u010del',f('sb_ucel')],['Miesto',f('sb_obec')+', k. \u00fa. '+f('sb_ku')+', parc. \u010d. '+f('sb_parc')],['Rozhodnutie o stavebnom z\u00e1mere',f('rozh_c')],['Overen\u00fd projekt',f('over_c')],['Dokon\u010den\u00e1 d\u0148a',f('dok')],['Odch\u00fdlky od projektu',f('odch')],['Stavbyved\u00faci / dozor',f('sv')]])+
   P('Stavba je dokon\u010den\u00e1 a sp\u00f4sobil\u00e1 na kolaud\u00e1ciu. Pri kolaud\u00e1cii bud\u00fa k dispoz\u00edcii v\u0161etky doklady o v\u00fdsledkoch predp\u00edsan\u00fdch sk\u00fa\u0161ok.')},

{id:'predcasne-uzivanie',c:3,t:'\u017diados\u0165 o pred\u010dasn\u00e9 u\u017e\u00edvanie stavby',
 d:'U\u017e\u00edvanie stavby alebo jej \u010dasti pred dokon\u010den\u00edm.',
 g:['urad','stavebnik','zastupca','stavba'],
 x:[{id:'rozh_c',l:'Povolenie stavby \u010d.'},
    {id:'cast',l:'\u010cas\u0165 stavby na pred\u010dasn\u00e9 u\u017e\u00edvanie',ta:1},
    {id:'dovod',l:'D\u00f4vod',ta:1},
    {id:'dokon',l:'Term\u00edn \u00fapln\u00e9ho dokon\u010denia',type:'date'}],
 p:['Vyhl\u00e1senie stavbyved\u00faceho o bezpe\u010dnosti u\u017e\u00edvania \u010dasti stavby','Rev\u00edzne spr\u00e1vy k dotknutej \u010dasti',PRIL.poplatok],
 s:'\u017diados\u0165 o povolenie pred\u010dasn\u00e9ho u\u017e\u00edvania stavby',
 b:f=>P(`Pod\u013ea ${LAW} \u017eiadam o povolenie pred\u010dasn\u00e9ho u\u017e\u00edvania stavby \u201e${f('sb_nazov')}\u201c, povolenej pod \u010d. ${f('rozh_c')}, v rozsahu: ${f('cast')}.`)+
   P(`Od\u00f4vodnenie: ${f('dovod')}`)+P(`Stavbu \u00faplne dokon\u010d\u00edm do ${f('dokon')}. Pred\u010dasn\u00e9 u\u017e\u00edvanie neohroz\u00ed bezpe\u010dnos\u0165 ani zdravie os\u00f4b.`)},

{id:'skusobna-prevadzka',c:3,t:'\u017diados\u0165 o do\u010dasn\u00e9 u\u017e\u00edvanie na sk\u00fa\u0161obn\u00fa prev\u00e1dzku',
 d:'Ak sa m\u00e1 overi\u0165 funk\u010dnos\u0165 stavby pred kolaud\u00e1ciou.',
 g:['urad','stavebnik','zastupca','stavba'],
 x:[{id:'rozh_c',l:'Povolenie stavby \u010d.'},
    {id:'ucel_sk',l:'\u00da\u010del a rozsah sk\u00fa\u0161obnej prev\u00e1dzky',ta:1},
    {id:'doba',l:'Navrhovan\u00e1 doba',ph:'napr. 6 mesiacov'}],
 p:['Program sk\u00fa\u0161obnej prev\u00e1dzky','Stanovisk\u00e1 dotknut\u00fdch org\u00e1nov',PRIL.poplatok],
 s:'\u017diados\u0165 o do\u010dasn\u00e9 u\u017e\u00edvanie stavby na sk\u00fa\u0161obn\u00fa prev\u00e1dzku',
 b:f=>P(`Pod\u013ea ${LAW} \u017eiadam o povolenie do\u010dasn\u00e9ho u\u017e\u00edvania stavby \u201e${f('sb_nazov')}\u201c, povolenej pod \u010d. ${f('rozh_c')}, na sk\u00fa\u0161obn\u00fa prev\u00e1dzku na dobu ${f('doba')}.`)+
   P(`\u00da\u010del a rozsah: ${f('ucel_sk')}`)},

{id:'zmena-ucelu',c:3,t:'\u017diados\u0165 o zmenu v u\u017e\u00edvan\u00ed stavby',
 d:'Zmena \u00fa\u010delu u\u017e\u00edvania dokon\u010denej stavby alebo jej \u010dasti.',
 g:['urad','stavebnik','zastupca','stavba'],
 x:[{id:'kol_c',l:'Kolauda\u010dn\u00e9 rozhodnutie / osved\u010denie \u010d.'},
    {id:'sucasny',l:'S\u00fa\u010dasn\u00fd \u00fa\u010del u\u017e\u00edvania'},
    {id:'novy_ucel',l:'Navrhovan\u00fd \u00fa\u010del u\u017e\u00edvania'},
    {id:'stav_upr',l:'Spojen\u00e9 so stavebn\u00fdmi \u00fapravami?',sel:['nie','\u00e1no \u2013 pod\u013ea prilo\u017eenej dokument\u00e1cie']}],
 p:['Dokument\u00e1cia zmeny v u\u017e\u00edvan\u00ed',PRIL.zs,PRIL.pravo,PRIL.poplatok],
 s:'\u017diados\u0165 o zmenu v u\u017e\u00edvan\u00ed stavby',
 b:f=>P(`Pod\u013ea ${LAW} \u017eiadam o povolenie zmeny v u\u017e\u00edvan\u00ed stavby \u201e${f('sb_nazov')}\u201c (${f('sb_obec')}, k. \u00fa. ${f('sb_ku')}, parc. \u010d. ${f('sb_parc')}), skolaudovanej pod \u010d. ${f('kol_c')}.`)+
   T([['S\u00fa\u010dasn\u00fd \u00fa\u010del',f('sucasny')],['Navrhovan\u00fd \u00fa\u010del',f('novy_ucel')],['Stavebn\u00e9 \u00fapravy',f('stav_upr')]])},

/* ---------- Odstr\u00e1nenie a legaliz\u00e1cia ---------- */
{id:'odstranenie',c:4,t:'Ohl\u00e1senie / \u017eiados\u0165 o odstr\u00e1nenie stavby',
 d:'Odstr\u00e1nenie (asan\u00e1cia) stavby na podnet vlastn\u00edka.',
 g:['urad','stavebnik','zastupca','stavba'],
 x:[{id:'dovod',l:'D\u00f4vod odstr\u00e1nenia',ta:1},
    {id:'sposob_o',l:'Sp\u00f4sob odstr\u00e1nenia',sel:['ru\u010dne','mechanizmami','kombinovane']},
    {id:'zhot',l:'Zhotovite\u013e / stavebn\u00fd dozor'},
    {id:'odpad',l:'Nakladanie so stavebn\u00fdm odpadom',ta:1},
    {id:'zac',l:'Predpokladan\u00fd term\u00edn',ph:'napr. 05/2026 \u2013 06/2026'}],
 p:['Dokument\u00e1cia odstr\u00e1nenia stavby','Statick\u00e9 pos\u00fadenie (ak sa vy\u017eaduje)','Vyjadrenia spr\u00e1vcov siet\u00ed o odpojen\u00ed',PRIL.pravo,PRIL.poplatok],
 s:'Odstr\u00e1nenie stavby',
 b:f=>P(`Pod\u013ea ${LAW} ohlasujem / \u017eiadam o povolenie odstr\u00e1nenia stavby:`)+
   T([['Stavba',f('sb_nazov')],['Miesto',f('sb_obec')+', k. \u00fa. '+f('sb_ku')+', parc. \u010d. '+f('sb_parc')+', LV \u010d. '+f('sb_lv')],['D\u00f4vod',f('dovod')],['Sp\u00f4sob',f('sposob_o')],['Zhotovite\u013e / dozor',f('zhot')],['Odpad',f('odpad')],['Term\u00edn',f('zac')]])},

{id:'dodatocne-povolenie',c:4,t:'\u017diados\u0165 o dodato\u010dn\u00e9 povolenie stavby',
 d:'Legaliz\u00e1cia stavby postavenej bez povolenia alebo v rozpore s n\u00edm.',
 g:['urad','stavebnik','zastupca','stavba','projektant'],
 x:[{id:'kedy',l:'Kedy bola stavba uskuto\u010dnen\u00e1'},
    {id:'stav',l:'Stav stavby',sel:['dokon\u010den\u00e1','rozostavan\u00e1']},
    {id:'popis',l:'Popis stavby',ta:1},
    {id:'dovod',l:'D\u00f4vod uskuto\u010dnenia bez povolenia',ta:1}],
 p:['Dokument\u00e1cia skuto\u010dn\u00e9ho vyhotovenia stavby','Statick\u00e9 pos\u00fadenie',PRIL.pravo,PRIL.zs,PRIL.vyj,PRIL.poplatok],
 s:'\u017diados\u0165 o dodato\u010dn\u00e9 povolenie stavby',
 b:f=>P(`Pod\u013ea ${LAW} \u017eiadam o dodato\u010dn\u00e9 povolenie stavby \u201e${f('sb_nazov')}\u201c na pozemkoch parc. \u010d. ${f('sb_parc')}, k. \u00fa. ${f('sb_ku')}.`)+
   T([['\u00da\u010del',f('sb_ucel')],['Stav stavby',f('stav')],['Uskuto\u010dnen\u00e1',f('kedy')],['Popis',f('popis')],['Dokument\u00e1ciu vypracoval',f('pr_meno')+', reg. \u010d. '+f('pr_reg')]])+
   P(`D\u00f4vod: ${f('dovod')}`)+P('Stavba nie je v rozpore s verejn\u00fdm z\u00e1ujmom ani s \u00fazemnopl\u00e1novacou dokument\u00e1ciou, \u010do preukazujem prilo\u017een\u00fdmi dokladmi.')},

{id:'podnet-dohlad',c:4,t:'Podnet na \u0161t\u00e1tny stavebn\u00fd doh\u013ead',
 d:'Upozornenie na nepovolen\u00fa stavbu alebo stavbu v rozpore s povolen\u00edm.',
 g:['urad','stavebnik','stavba'],
 x:[{id:'kto',l:'Stavebn\u00edk / vlastn\u00edk dotknutej stavby (ak je zn\u00e1my)'},
    {id:'popis',l:'Opis zisten\u00fdch skuto\u010dnost\u00ed',ta:1},
    {id:'odkedy',l:'Odkedy sa stavebn\u00e1 \u010dinnos\u0165 vykon\u00e1va'},
    {id:'dokazy',l:'D\u00f4kazy',ph:'fotodokument\u00e1cia, svedkovia \u2026'}],
 p:['Fotodokument\u00e1cia'],
 s:'Podnet na vykonanie \u0161t\u00e1tneho stavebn\u00e9ho doh\u013eadu',
 b:f=>P(`Pod\u00e1vam podnet na vykonanie \u0161t\u00e1tneho stavebn\u00e9ho doh\u013eadu pod\u013ea ${LAW} na stavbe v lokalite ${f('sb_obec')}, k. \u00fa. ${f('sb_ku')}, parc. \u010d. ${f('sb_parc')}.`)+
   T([['Stavebn\u00edk / vlastn\u00edk',f('kto')],['Zisten\u00e9 skuto\u010dnosti',f('popis')],['Odkedy',f('odkedy')],['D\u00f4kazy',f('dokazy')]])+
   P('\u017diadam o p\u00edsomn\u00e9 ozn\u00e1menie v\u00fdsledku vybavenia podnetu.')},

/* ---------- Konanie a s\u00fahlasy ---------- */
{id:'splnomocnenie',c:5,t:'Splnomocnenie na zastupovanie',
 d:'Pln\u00e1 moc pre projektanta, in\u017einiera stavby alebo in\u00fa osobu.',
 g:['stavebnik','zastupca','stavba'], nosender:1,
 x:[{id:'zs_nar',l:'Splnomocnenec \u2013 d\u00e1tum narodenia / I\u010cO'},
    {id:'rozsah',l:'Rozsah splnomocnenia',sel:['vo v\u0161etk\u00fdch konaniach a \u00fakonoch pod\u013ea stavebn\u00e9ho z\u00e1kona t\u00fdkaj\u00facich sa stavby','v konan\u00ed o stavebnom z\u00e1mere','pri overen\u00ed projektu stavby','v kolauda\u010dnom konan\u00ed','pri zabezpe\u010den\u00ed vyjadren\u00ed a z\u00e1v\u00e4zn\u00fdch stanov\u00edsk']}],
 p:[],
 title:'Splnomocnenie',
 b:f=>P(`Splnomocnite\u013e: <b>${f('st_meno')}</b>, nar./I\u010cO ${f('st_id')}, bytom/s\u00eddlo ${f('st_adresa')}`)+
   P(`t\u00fdmto splnomoc\u0148uje<br>splnomocnenca: <b>${f('zs_meno')}</b>, nar./I\u010cO ${f('zs_nar')}, bytom/s\u00eddlo ${f('zs_adresa')},`)+
   P(`aby ho zastupoval ${f('rozsah')} \u2013 stavba \u201e${f('sb_nazov')}\u201c na pozemkoch parc. \u010d. ${f('sb_parc')}, k. \u00fa. ${f('sb_ku')}, najm\u00e4 pod\u00e1val \u017eiadosti a podania, nahliadal do spisu, preberal p\u00edsomnosti a robil v\u0161etky \u00fakony s t\u00fdm spojen\u00e9.`)+
   '<div class="sig" style="margin-left:0;display:flex;gap:40px;justify-content:space-between;text-align:center"><div style="flex:1">splnomocnite\u013e</div><div style="flex:1">Splnomocnenie prij\u00edmam.<br><br>splnomocnenec</div></div>'},

{id:'cestne-vyhlasenie',c:5,t:'\u010cestn\u00e9 vyhl\u00e1senie',
 d:'Napr. o vlastn\u00edckom pr\u00e1ve, o pravdivosti \u00fadajov, o svojpomoci.',
 g:['stavebnik','stavba'], nosender:1,
 x:[{id:'obsah',l:'Obsah vyhl\u00e1senia',ta:1,ph:'napr. \u017ee som v\u00fdlu\u010dn\u00fdm vlastn\u00edkom pozemku\u2026'}],
 p:[],
 title:'\u010cestn\u00e9 vyhl\u00e1senie',
 b:f=>P(`Dolupodp\u00edsan\u00fd/\u00e1 ${f('st_meno')}, nar./I\u010cO ${f('st_id')}, bytom/s\u00eddlo ${f('st_adresa')}, v s\u00favislosti so stavbou \u201e${f('sb_nazov')}\u201c na pozemkoch parc. \u010d. ${f('sb_parc')}, k. \u00fa. ${f('sb_ku')},`)+
   P(`<b>\u010destne vyhlasujem</b>, \u017ee ${f('obsah')}`)+
   P('Som si vedom\u00fd/\u00e1 pr\u00e1vnych n\u00e1sledkov nepravdiv\u00e9ho vyhl\u00e1senia.')},

{id:'odvolanie',c:5,t:'Odvolanie proti rozhodnutiu',
 d:'Riadny opravn\u00fd prostriedok proti rozhodnutiu stavebn\u00e9ho \u00faradu.',
 g:['urad','stavebnik','zastupca','stavba'],
 x:[{id:'rozh_c',l:'Napadnut\u00e9 rozhodnutie \u010d.'},
    {id:'rozh_d',l:'zo d\u0148a',type:'date'},
    {id:'dor',l:'Doru\u010den\u00e9 d\u0148a',type:'date'},
    {id:'postavenie',l:'Moje postavenie v konan\u00ed',sel:['stavebn\u00edk','\u00fa\u010dastn\u00edk konania \u2013 vlastn\u00edk susedn\u00e9ho pozemku','\u00fa\u010dastn\u00edk konania']},
    {id:'dovody',l:'D\u00f4vody odvolania',ta:1},
    {id:'navrh',l:'N\u00e1vrh',sel:['zru\u0161i\u0165 napadnut\u00e9 rozhodnutie a vec vr\u00e1ti\u0165 na nov\u00e9 prejednanie','zmeni\u0165 napadnut\u00e9 rozhodnutie','zru\u0161i\u0165 napadnut\u00e9 rozhodnutie']}],
 p:['K\u00f3pia napadnut\u00e9ho rozhodnutia'],
 s:'Odvolanie proti rozhodnutiu',
 b:f=>P(`Ako ${f('postavenie')} pod\u00e1vam v z\u00e1konnej lehote <b>odvolanie</b> proti rozhodnutiu \u010d. ${f('rozh_c')} zo d\u0148a ${f('rozh_d')}, ktor\u00e9 mi bolo doru\u010den\u00e9 d\u0148a ${f('dor')}, vo veci stavby \u201e${f('sb_nazov')}\u201c, k. \u00fa. ${f('sb_ku')}, parc. \u010d. ${f('sb_parc')}.`)+
   P('<b>Od\u00f4vodnenie:</b>')+P(f('dovody'))+
   P(`<b>N\u00e1vrh:</b> Navrhujem, aby odvolac\u00ed org\u00e1n ${f('navrh')}.`)+
   P('<span class="small">Odvolanie sa pod\u00e1va na spr\u00e1vnom org\u00e1ne, ktor\u00fd rozhodnutie vydal, v lehote uvedenej v pou\u010den\u00ed rozhodnutia.</span>')},

{id:'namietky',c:5,t:'N\u00e1mietky \u00fa\u010dastn\u00edka konania',
 d:'N\u00e1mietky a pripomienky k stavebn\u00e9mu z\u00e1meru suseda alebo inej stavby.',
 g:['urad','stavebnik','stavba'],
 x:[{id:'spis',l:'\u010c\u00edslo spisu / konania'},
    {id:'stavebnik2',l:'Stavebn\u00edk (navrhovate\u013e)'},
    {id:'moje',l:'Moja nehnute\u013enos\u0165 (parc. \u010d., k. \u00fa.)'},
    {id:'nam',l:'N\u00e1mietky a ich od\u00f4vodnenie',ta:1}],
 p:[],
 s:'N\u00e1mietky \u00fa\u010dastn\u00edka konania',
 b:f=>P(`V konan\u00ed vedenom pod \u010d. ${f('spis')} o stavbe \u201e${f('sb_nazov')}\u201c stavebn\u00edka ${f('stavebnik2')} na pozemkoch parc. \u010d. ${f('sb_parc')}, k. \u00fa. ${f('sb_ku')}, pod\u00e1vam ako vlastn\u00edk nehnute\u013enosti ${f('moje')} tieto <b>n\u00e1mietky</b>:`)+
   P(f('nam'))+P('\u017diadam, aby stavebn\u00fd \u00farad o n\u00e1mietkach rozhodol a vysporiadal sa s nimi v od\u00f4vodnen\u00ed rozhodnutia.')},

{id:'nahliadnutie',c:5,t:'\u017diados\u0165 o nahliadnutie do spisu',
 d:'Nahliadnutie, v\u00fdpisy a k\u00f3pie zo spisov\u00e9ho materi\u00e1lu.',
 g:['urad','stavebnik','stavba'],
 x:[{id:'spis',l:'\u010c\u00edslo spisu / konania'},
    {id:'postavenie',l:'Postavenie',sel:['\u00fa\u010dastn\u00edk konania','stavebn\u00edk','z\u00e1stupca \u00fa\u010dastn\u00edka']},
    {id:'kopie',l:'\u017diadam aj o k\u00f3pie',sel:['nie','\u00e1no \u2013 cel\u00e9ho spisu','\u00e1no \u2013 vybran\u00fdch dokumentov']}],
 p:[],
 s:'\u017diados\u0165 o nahliadnutie do spisu',
 b:f=>P(`Ako ${f('postavenie')} v konan\u00ed vedenom pod \u010d. ${f('spis')} vo veci stavby \u201e${f('sb_nazov')}\u201c, k. \u00fa. ${f('sb_ku')}, \u017eiadam o umo\u017enenie nahliadnu\u0165 do spisu, robi\u0165 si z neho v\u00fdpisy a odpisy.`)+
   P(`K\u00f3pie dokumentov: ${f('kopie')}.`)+P(`Term\u00edn nahliadnutia pros\u00edm ozn\u00e1mi\u0165 telefonicky na \u010d\u00edsle ${f('st_tel')} alebo e-mailom.`)},

{id:'spatvzatie',c:5,t:'Sp\u00e4\u0165vzatie \u017eiadosti',
 d:'Zastavenie konania na n\u00e1vrh \u017eiadate\u013ea.',
 g:['urad','stavebnik','stavba'],
 x:[{id:'spis',l:'\u010c\u00edslo spisu / konania'},
    {id:'podana',l:'\u017diados\u0165 podan\u00e1 d\u0148a',type:'date'},
    {id:'ziadost',l:'Druh \u017eiadosti',ph:'napr. \u017eiados\u0165 o vydanie rozhodnutia o stavebnom z\u00e1mere'}],
 p:[],
 s:'Sp\u00e4\u0165vzatie \u017eiadosti',
 b:f=>P(`T\u00fdmto beriem sp\u00e4\u0165 svoju \u017eiados\u0165 (${f('ziadost')}) podan\u00fa d\u0148a ${f('podana')}, veden\u00fa pod \u010d. ${f('spis')}, vo veci stavby \u201e${f('sb_nazov')}\u201c, k. \u00fa. ${f('sb_ku')}, parc. \u010d. ${f('sb_parc')}.`)+
   P('\u017diadam o zastavenie konania.')}
];


/* ---------- Stav ---------- */
const K_SHARED='spv_shared_v1', K_EXTRA='spv_extra_v1';
const load=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const today=()=>new Date().toISOString().slice(0,10);
let shared = load(K_SHARED) || {...SAMPLE, datum:today()};
let extra = load(K_EXTRA) || {};
let cur=null, root=null;
/* V r\u00e1mci artifactu (iframe) nefunguje tla\u010d ani s\u0165ahovanie \u2013 tla\u010didl\u00e1 skryjeme. Na webe funguj\u00fa. */
const inFrame = (()=>{try{return window.self!==window.top}catch(e){return true}})() && /claude/.test(location.hostname+document.referrer);

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtDate=s=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');return m?`${+m[3]}. ${+m[2]}. ${m[1]}`:s};
const allFields=t=>[...t.g.flatMap(g=>GROUPS[g].f),...t.x,...GROUPS.podpis.f];
const isShared=id=>Object.values(GROUPS).some(g=>g.f.some(x=>x.id===id));
const get=id=>isShared(id)?(shared[id]||''):((extra[cur.id]||{})[id]||'');
const fieldDef=id=>allFields(cur).find(x=>x.id===id);
function f(id,fallback){
  let v=get(id); const def=fieldDef(id)||{};
  if(def.type==='date') v=fmtDate(v);
  if(!v) return fallback?esc(fallback):`<span class="blank">${esc(def.l||id)}</span>`;
  return esc(v).replace(/\n/g,'<br>');
}
const $=s=>root.querySelector(s);
const HASH='vzor-';
const setHash=h=>{try{history.replaceState(null,'',h?'#'+HASH+h:location.pathname+location.search)}catch(e){}};

/* ---------- Ponuka vzorov ---------- */
function renderCatalog(){
  cur=null;
  root.innerHTML=`<div class="spv-head">
     <h1>Stavebn\u00e9 podania<span>vzory pod\u013ea nov\u00e9ho stavebn\u00e9ho z\u00e1kona</span></h1>
     <p>${TPL.length} vzorov pre cel\u00fd priebeh stavby \u2013 od pr\u00edpravy cez povolenie, v\u00fdstavbu a kolaud\u00e1ciu a\u017e po odvolanie. Vyberte vzor, vypl\u0148te \u00fadaje a hotov\u00e9 podanie si vytla\u010dte, ulo\u017ete do Wordu alebo skop\u00edrujte. \u00dadaje o stavebn\u00edkovi a stavbe sa pren\u00e1\u0161aj\u00fa medzi vzormi.</p>
     <span class="spv-law">z\u00e1kon \u010d. 25/2025 Z. z. \u2013 Stavebn\u00fd z\u00e1kon, \u00fa\u010dinn\u00fd od 1. 4. 2025</span>
   </div>
   <div class="spv-searchrow"><input class="spv-search" id="spv-q" type="search" placeholder="Nap\u00ed\u0161te, \u010do potrebujete poda\u0165 (napr. kolaud\u00e1cia, sused, ohl\u00e1senie)" aria-label="H\u013eada\u0165 vzor"><button type="button" class="spv-btn spv-btn-pri" id="spv-qbtn">H\u013eada\u0165</button></div>
   <div id="spv-list"></div>
   <p class="spv-note">Vzory s\u00fa pom\u00f4cka na pr\u00edpravu podania pod\u013ea z\u00e1kona \u010d. 25/2025 Z. z. Podania sa pod\u013ea nov\u00e9ho z\u00e1kona pod\u00e1vaj\u00fa najm\u00e4 elektronicky cez informa\u010dn\u00fd syst\u00e9m \u00fazemn\u00e9ho pl\u00e1novania a v\u00fdstavby; listinn\u00fd vzor sl\u00fa\u017ei ako podklad alebo pre listinn\u00e9 podanie. Pred podan\u00edm overte aktu\u00e1lne znenie predpisov a po\u017eiadavky pr\u00edslu\u0161n\u00e9ho stavebn\u00e9ho \u00faradu. Vzor nenahr\u00e1dza pr\u00e1vne poradenstvo.</p>`;
  const q=$('#spv-q');
  const draw=()=>{
    const s=q.value.trim().toLowerCase();
    const html=CATS.map((c,i)=>{
      const it=TPL.filter(t=>t.c===i&&(!s||(t.t+' '+t.d+' '+c).toLowerCase().includes(s)));
      if(!it.length) return '';
      return `<section class="spv-sec"><h2>${c} <i>${it.length}</i></h2><div class="spv-cards">${it.map(t=>`<button type="button" class="spv-card" data-id="${t.id}"><b>${t.t}</b><span>${t.d}</span><em>Vyplni\u0165 vzor \u203a</em></button>`).join('')}</div></section>`;
    }).join('');
    $('#spv-list').innerHTML=html||'<p class="spv-empty">\u017diadny vzor nezodpoved\u00e1 h\u013eadaniu. Sk\u00faste in\u00e9 slovo.</p>';
  };
  q.addEventListener('input',draw);
  q.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();draw()}});
  $('#spv-qbtn').onclick=draw;
  $('#spv-list').addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(b)open(b.dataset.id)});
  draw(); setHash('');
}

/* ---------- Editor ---------- */
function input(def){
  const v=esc(get(def.id)); const id='spv-f-'+def.id;
  let el;
  if(def.sel) el=`<select id="${id}" data-k="${def.id}"><option value="">\u2014 vyberte \u2014</option>${def.sel.map(o=>`<option${get(def.id)===o?' selected':''}>${esc(o)}</option>`).join('')}</select>`;
  else if(def.ta) el=`<textarea id="${id}" data-k="${def.id}" placeholder="${esc(def.ph||'')}">${v}</textarea>`;
  else el=`<input id="${id}" data-k="${def.id}" type="${def.type||'text'}" value="${v}" placeholder="${esc(def.ph||'')}">`;
  return `<label class="spv-f" for="${id}">${esc(def.l)}${el}</label>`;
}
function open(id){
  cur=TPL.find(t=>t.id===id); if(!cur) return renderCatalog();
  const ex=extra[cur.id]||(extra[cur.id]={});
  if(!ex._pr) ex._pr=cur.p.map(()=>true);
  const groups=cur.g.map(g=>`<fieldset><legend>${GROUPS[g].t}${GROUPS[g].o?` <small>(${GROUPS[g].o})</small>`:''}</legend>${GROUPS[g].f.map(input).join('')}</fieldset>`);
  if(cur.x.length) groups.push(`<fieldset><legend>\u00dadaje k tomuto podaniu</legend>${cur.x.map(input).join('')}</fieldset>`);
  if(cur.p.length) groups.push(`<fieldset><legend>Pr\u00edlohy</legend>${cur.p.map((p,i)=>`<label class="spv-chk"><input type="checkbox" id="spv-pr-${i}" data-pr="${i}"${ex._pr[i]?' checked':''}>${esc(p)}</label>`).join('')}${input({id:'_dalsie',l:'\u010eal\u0161ie pr\u00edlohy (ka\u017ed\u00e1 na nov\u00fd riadok)',ta:1})}</fieldset>`);
  groups.push(`<fieldset><legend>Miesto a d\u00e1tum</legend>${GROUPS.podpis.f.map(input).join('')}</fieldset>`);
  const opts=CATS.map((c,i)=>`<optgroup label="${c}">${TPL.filter(t=>t.c===i).map(t=>`<option value="${t.id}"${t.id===cur.id?' selected':''}>${t.t}</option>`).join('')}</optgroup>`).join('');
  root.innerHTML=`<div class="spv-head"><h1>Stavebn\u00e9 podania<span>vzory pod\u013ea nov\u00e9ho stavebn\u00e9ho z\u00e1kona</span></h1></div>
   <div class="spv-bar"><button type="button" class="spv-back" id="spv-back">\u2039 V\u0161etky vzory</button>
     <select class="spv-switch" id="spv-switch" aria-label="Prejs\u0165 na in\u00fd vzor">${opts}</select></div>
   <div class="spv-edit"><form class="spv-form" id="spv-frm" autocomplete="off">
     <h2>${cur.t}</h2><p class="spv-desc">${cur.d}</p>
     <div class="spv-tools">
       ${inFrame?'':'<button type="button" class="spv-btn spv-btn-pri" id="spv-print">Tla\u010di\u0165 / PDF</button><button type="button" class="spv-btn" id="spv-doc">Stiahnu\u0165 do Wordu</button>'}
       <button type="button" class="spv-btn${inFrame?' spv-btn-pri':''}" id="spv-copy">Kop\u00edrova\u0165</button>
       <button type="button" class="spv-btn" id="spv-clear">Vy\u010disti\u0165 \u00fadaje</button>
     </div>
     ${groups.join('')}
   </form>
   <div class="spv-paperwrap"><div class="spv-paper" id="spv-paper"></div></div></div>
   <div class="spv-toast" id="spv-toast" hidden></div>`;
  const frm=$('#spv-frm');
  frm.addEventListener('input',onInput); frm.addEventListener('change',onInput);
  frm.addEventListener('submit',e=>e.preventDefault());
  $('#spv-back').onclick=renderCatalog;
  $('#spv-switch').onchange=e=>open(e.target.value);
  $('#spv-copy').onclick=copyDoc;
  $('#spv-clear').onclick=clearData;
  if(!inFrame){$('#spv-print').onclick=printDoc;$('#spv-doc').onclick=downloadDoc;}
  renderPaper(); setHash(cur.id);
  const top=root.getBoundingClientRect().top+window.scrollY-20; if(window.scrollY>top) window.scrollTo(0,top);
}
function onInput(e){
  const t=e.target;
  if(t.dataset.pr!==undefined) extra[cur.id]._pr[+t.dataset.pr]=t.checked;
  else if(t.dataset.k){const k=t.dataset.k; if(isShared(k)) shared[k]=t.value; else extra[cur.id][k]=t.value;}
  else return;
  save(K_SHARED,shared); save(K_EXTRA,extra); renderPaper();
}
let clearArmed=false;
function clearData(){
  const b=$('#spv-clear');
  if(!clearArmed){clearArmed=true;b.textContent='Naozaj vy\u010disti\u0165?';setTimeout(()=>{clearArmed=false;if(b.isConnected)b.textContent='Vy\u010disti\u0165 \u00fadaje'},3000);return}
  clearArmed=false; shared={datum:today()}; extra={};
  save(K_SHARED,shared); save(K_EXTRA,extra); open(cur.id); toast('\u00dadaje vy\u010disten\u00e9');
}

function docHTML(){
  const t=cur, ex=extra[t.id]||{};
  const sender = t.nosender?'':`<div class="sender">${f('st_meno')}, ${f('st_adresa')}${get('st_tel')?', tel. '+f('st_tel'):''}${get('st_email')?', '+f('st_email'):''}</div>`;
  let rcp='';
  if(!t.nosender){const [n,a]=t.rcp||['urad_nazov','urad_adresa']; rcp=`<div class="rcp">${f(n)}<br>${f(a)}</div>`;}
  const zast = t.g.includes('zastupca') && get('zs_meno') && t.id!=='splnomocnenie';
  const head = t.nosender ? `<h3>${t.title}</h3>` : `<div class="dt">V ${f('miesto')} d\u0148a ${f('datum')}</div><p class="vec">Vec: <span>${t.s}</span></p>`;
  const zastLine = zast?P(`Stavebn\u00edka v konan\u00ed zastupuje na z\u00e1klade splnomocnenia: ${f('zs_meno')}, ${f('zs_adresa')}.`):'';
  const prilohy=[...t.p.filter((_,i)=>(ex._pr||[])[i]!==false),...String(ex._dalsie||'').split('\n').map(s=>s.trim()).filter(Boolean)];
  let sig='';
  if(t.id!=='splnomocnenie'){
    const who = t.signer?f(t.signer):(zast?`${f('st_meno')}<br>v zast\u00fapen\u00ed ${f('zs_meno')}`:f('st_meno'));
    sig=`<div class="sig"><div>${who}<br><span class="small">podpis${t.signer||t.nosender?'':' stavebn\u00edka'}</span></div></div>`;
  }
  const footDt = t.nosender?`<p style="margin-top:28px">V ${f('miesto')} d\u0148a ${f('datum')}</p>`:'';
  const att = prilohy.length?`<div class="att"><b>Pr\u00edlohy:</b><ol>${prilohy.map(p=>`<li>${esc(p)}</li>`).join('')}</ol></div>`:'';
  return sender+rcp+head+t.b(f)+zastLine+footDt+sig+att;
}
function renderPaper(){$('#spv-paper').innerHTML=docHTML()}

/* Export: pr\u00e1zdne polia nahrad\u00edme bodkami, aby sa dali vyplni\u0165 ru\u010dne */
function exportBody(){
  const tmp=document.createElement('div'); tmp.innerHTML=docHTML();
  tmp.querySelectorAll('.blank').forEach(s=>s.replaceWith('.....................'));
  return tmp;
}
const DOC_CSS='body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.45;color:#000;margin:0}.sender{border-bottom:1px solid #999;font-size:11pt;padding-bottom:4pt;margin-bottom:24pt}.rcp{margin-left:50%;margin-bottom:24pt}.dt{text-align:right;margin-bottom:14pt}.vec{font-weight:bold;margin-bottom:12pt}.vec span{font-weight:normal}h3{text-align:center;text-transform:uppercase;font-size:13pt;letter-spacing:.04em}p{text-align:justify;margin:0 0 8pt}table{border-collapse:collapse;width:100%;margin:4pt 0 10pt}td{border:1px solid #888;padding:3pt 6pt;vertical-align:top}td:first-child{width:38%}.sig{margin-top:36pt;margin-left:50%;text-align:center}.sig div{border-top:1px dotted #444;padding-top:3pt}.small{font-size:10pt}.att{margin-top:24pt;font-size:11pt}@page{size:A4;margin:2cm}';
function printDoc(){
  const fr=document.createElement('iframe');
  fr.setAttribute('aria-hidden','true');
  fr.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(fr);
  const d=fr.contentWindow.document;
  d.open(); d.write(`<!doctype html><html lang="sk"><head><meta charset="utf-8"><title>${esc(cur.t)}</title><style>${DOC_CSS}</style></head><body>${exportBody().innerHTML}</body></html>`); d.close();
  setTimeout(()=>{fr.contentWindow.focus();fr.contentWindow.print();setTimeout(()=>fr.remove(),1000)},250);
}
function downloadDoc(){
  const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(cur.t)}</title><style>${DOC_CSS}</style></head><body>${exportBody().innerHTML}</body></html>`;
  const blob=new Blob(['\ufeff',html],{type:'application/msword'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=cur.id+'.doc';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),2000);
  toast('S\u00fabor sa s\u0165ahuje');
}
async function copyDoc(){
  const tmp=exportBody(); const html=`<style>${DOC_CSS}</style>`+tmp.innerHTML; const text=tmp.innerText;
  try{
    if(window.ClipboardItem) await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([html],{type:'text/html'}),'text/plain':new Blob([text],{type:'text/plain'})})]);
    else await navigator.clipboard.writeText(text);
    toast('Skop\u00edrovan\u00e9 \u2013 vlo\u017ete do Wordu (Ctrl+V)');
  }catch(e){
    try{await navigator.clipboard.writeText(text);toast('Skop\u00edrovan\u00e9 ako text');}
    catch(e2){const r=document.createRange();r.selectNodeContents($('#spv-paper'));const s=getSelection();s.removeAllRanges();s.addRange(r);toast('Text je ozna\u010den\u00fd \u2013 stla\u010dte Ctrl+C');}
  }
}
let tt;function toast(m){const el=$('#spv-toast');if(!el)return;el.textContent=m;el.hidden=false;clearTimeout(tt);tt=setTimeout(()=>el.hidden=true,2600)}

/* ---------- Spustenie ---------- */
function mount(el){
  root=el; root.classList.add('spv');
  const h=location.hash.slice(1);
  if(h.indexOf(HASH)===0 && TPL.some(t=>t.id===h.slice(HASH.length))) open(h.slice(HASH.length)); else renderCatalog();
}
window.StavebnePodania={mount,version:'1.0.0'};
function auto(){const el=document.getElementById('sp-vzory');if(el&&!el.dataset.manual)mount(el)}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',auto); else auto();

})();
