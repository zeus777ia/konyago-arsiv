import{c as e,n as t}from"./createLucideIcon-Bqz0ZtiK.js";import{n}from"./not-found-i5RsCZif.js";import{T as r,h as i,o as a,s as o,t as s,v as c,x as l,y as u}from"./layout-BaMiHn02.js";import{t as d}from"./icons-O-jGypYr.js";import{t as f}from"./chevron-right-dPTC_Kxt.js";import{A as p,M as m,N as h}from"./store-BbI0cyA1.js";import{t as g}from"./lock-CSPdwT3E.js";import{r as _}from"./index-7kM928Sd.js";import{i as v,s as y}from"./data-BNj-LuKD.js";import{t as b}from"./names-CNWifN8M.js";import{t as x}from"./fresh-badge-BggY4H3N.js";var S={genel:[{title:`Kendimi tanıtayım — Konya’dan yazıyorum`,body:`Merhaba!

Semtim:
Neden buradayım:
İlgilendiğim konular:

(Kısa ve saygılı tutalım.)`},{title:`Bugün Konya’da ne yapmalı?`,body:`Arkadaşlar, bugün / bu hafta sonu için önerileriniz neler?

Bütçe:
İlgi alanları:`}],tarih:[{title:`Selçuklu mirası hakkında bir sorum var`,body:`Merhaba,

Konu:
Gördüğüm / okuduğum kaynak:
Sorum:

Kaynak paylaşırsanız sevinirim.`}],mevlana:[{title:`Mevlana Müzesi ziyaret notlarım`,body:`Ziyaret tarihi:
Süre:
Dikkat edilmesi gerekenler:

Kısaca izlenimlerim:`}],gezi:[{title:`Bu hafta sonu gezi planı arıyorum`,body:`Kaç kişiyiz:
Araç var mı:
İlgilendiğim yerler:

Önerilerinizi yazın.`}],semt:[{title:`Semtimden notlar: [semt adı]`,body:`Semt:
En sevdiğim köşe:
Yeni gelenlere tavsiye:
`}],rotalar:[{title:`1 günlük Konya rotası (öneri)`,body:`Sabah:
Öğle:
Akşam:
Ulaşım notu:
`}],mutfak:[{title:`Etli ekmek / fırın önerisi arıyorum`,body:`Semt:
Tercihler (etli, sebzeli…):
Bütçe:
`}],sicak:[{title:`Gündem: bugün konuşalım`,body:`Konu özeti:
Ne düşünüyorsunuz?

Lütfen saygılı ve doğrulanabilir bilgi paylaşın.`}],default:[{title:`Bu bölümde ilk konuyu açıyorum`,body:`Merhaba,

Kısaca:

Soru / paylaşım:
`},{title:`Tavsiye istiyorum`,body:`Konu:
Detay:
Beklentim:
`}]};function C(e){return S[e]??S.default}var w=e();function T(){let{categoryId:e}=_.useParams(),S=v(e),T=l(),E=u(T),D=o(e=>e.names),O=o(e=>e.posts),k=o(e=>e.threads),A=a(k.filter(t=>t.categoryId===e),{isFounder:E,authorName:T?.displayName,names:D,includePendingOwn:!0}).sort((e,t)=>e.pinned&&!t.pinned?-1:!e.pinned&&t.pinned?1:new Date(t.lastPostAt)-+new Date(e.lastPostAt)),j=A.filter(y),M=O.filter(e=>j.some(t=>t.id===e.threadId)).length;if(!S)throw n();let N=i(e)&&!E;return(0,w.jsxs)(s,{children:[(0,w.jsxs)(`nav`,{className:`mb-3 flex flex-wrap items-center gap-1 text-xs text-muted`,children:[(0,w.jsx)(t,{to:`/`,className:`hover:text-primary`,children:`Ana sayfa`}),(0,w.jsx)(f,{className:`size-3`}),(0,w.jsx)(`span`,{className:`text-fg`,children:S.name})]}),(0,w.jsxs)(`div`,{className:`mb-4 flex flex-wrap items-start justify-between gap-3`,children:[(0,w.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,w.jsx)(`span`,{className:`flex size-11 shrink-0 items-center justify-center rounded-lg text-white`,style:{backgroundColor:S.color},children:(0,w.jsx)(d,{name:S.icon,className:`size-5`})}),(0,w.jsxs)(`div`,{children:[(0,w.jsx)(`h1`,{className:`text-lg font-semibold tracking-tight text-fg sm:text-xl`,children:S.name}),(0,w.jsx)(`p`,{className:`mt-0.5 text-sm text-muted`,children:S.description}),(0,w.jsxs)(`p`,{className:`mt-1 text-xs text-subtle`,children:[m(j.length),` konu ·`,` `,m(M),` mesaj`]}),N&&(0,w.jsxs)(`p`,{className:`mt-2 inline-flex items-center gap-1 rounded-md bg-badge px-2 py-1 text-[11px] font-medium text-muted`,children:[(0,w.jsx)(g,{className:`size-3`}),`Bu bölüme yalnızca kurucu konu açabilir`]})]})]}),N?(0,w.jsxs)(p,{variant:`secondary`,disabled:!0,children:[(0,w.jsx)(g,{className:`size-3.5`}),`Konu açılamaz`]}):(0,w.jsx)(p,{asChild:!0,children:(0,w.jsxs)(t,{to:`/yeni-konu`,search:{kategori:S.id},children:[(0,w.jsx)(r,{className:`size-3.5`}),`Yeni konu`]})})]}),(0,w.jsxs)(`section`,{className:`overflow-hidden rounded-lg border border-border bg-surface shadow-card`,children:[(0,w.jsx)(`header`,{className:`border-b border-border bg-header px-3 py-2 sm:px-4`,children:(0,w.jsx)(`h2`,{className:`text-xs font-semibold tracking-wide text-header-fg uppercase`,children:`Konular`})}),A.length>0?(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(`div`,{className:`hidden md:block`,children:(0,w.jsxs)(`table`,{className:`w-full text-left text-sm`,children:[(0,w.jsx)(`thead`,{className:`border-b border-border bg-row text-[11px] tracking-wide text-subtle uppercase`,children:(0,w.jsxs)(`tr`,{children:[(0,w.jsx)(`th`,{className:`px-4 py-2 font-medium`,children:`Konu`}),(0,w.jsx)(`th`,{className:`px-3 py-2 text-right font-medium`,children:`Cevap`}),(0,w.jsx)(`th`,{className:`px-3 py-2 text-right font-medium`,children:`Hit`}),(0,w.jsx)(`th`,{className:`px-4 py-2 text-right font-medium`,children:`Son yazan`})]})}),(0,w.jsx)(`tbody`,{className:`divide-y divide-border`,children:A.map((e,n)=>(0,w.jsxs)(`tr`,{className:n%2==0?`bg-row-alt`:`bg-row`,children:[(0,w.jsxs)(`td`,{className:`px-4 py-2.5`,children:[(0,w.jsxs)(`div`,{className:`flex flex-wrap items-center gap-1.5`,children:[e.pinned&&(0,w.jsx)(`span`,{className:`rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold text-primary`,children:`SABİT`}),e.hot&&(0,w.jsx)(`span`,{className:`rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent`,children:`SICAK`}),e.locked&&(0,w.jsx)(`span`,{className:`rounded bg-badge px-1.5 py-0.5 text-[10px] font-semibold text-muted`,children:`KİLİT`}),e.status===`pending`&&(0,w.jsx)(`span`,{className:`rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800`,children:`İNCELEMEDE`}),(0,w.jsx)(t,{to:`/konu/$threadId`,params:{threadId:e.id},className:`font-medium text-fg hover:text-primary`,children:e.title}),(0,w.jsx)(x,{thread:e})]}),(0,w.jsxs)(`p`,{className:`mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-subtle`,children:[(0,w.jsx)(c,{name:b(e.authorId,D),size:`sm`,showBadge:!1}),(0,w.jsxs)(`span`,{children:[`· `,h(e.createdAt)]})]})]}),(0,w.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums text-muted`,children:e.replies}),(0,w.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums text-muted`,children:m(e.views)}),(0,w.jsxs)(`td`,{className:`px-4 py-2.5 text-right text-xs`,children:[(0,w.jsx)(`div`,{className:`flex justify-end`,children:(0,w.jsx)(c,{name:b(e.lastPosterId,D),size:`sm`,showBadge:!1})}),(0,w.jsx)(`div`,{className:`text-subtle`,children:h(e.lastPostAt)})]})]},e.id))})]})}),(0,w.jsx)(`ul`,{className:`divide-y divide-border md:hidden`,children:A.map(e=>(0,w.jsxs)(`li`,{className:`px-3 py-3`,children:[(0,w.jsx)(t,{to:`/konu/$threadId`,params:{threadId:e.id},className:`text-sm font-medium text-fg hover:text-primary`,children:e.title}),(0,w.jsxs)(`p`,{className:`mt-1 text-[11px] text-subtle`,children:[e.replies,` cevap · `,m(e.views),` hit ·`,` `,h(e.lastPostAt)]})]},e.id))})]}):(0,w.jsxs)(`div`,{className:`px-4 py-8`,children:[(0,w.jsx)(`p`,{className:`text-center text-sm text-muted`,children:`Bu kategoride henüz konu yok — ilk sen yaz.`}),!N&&(0,w.jsx)(`div`,{className:`mx-auto mt-4 max-w-lg space-y-2`,children:C(S.id).map(e=>(0,w.jsxs)(t,{to:`/yeni-konu`,search:{kategori:S.id},className:`block rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-left transition-colors hover:border-primary/30 hover:bg-primary-soft/40`,onClick:()=>{try{sessionStorage.setItem(`konyago-draft-topic`,JSON.stringify({title:e.title,body:e.body,kategori:S.id}))}catch{}},children:[(0,w.jsx)(`p`,{className:`text-sm font-medium text-fg`,children:e.title}),(0,w.jsx)(`p`,{className:`mt-0.5 line-clamp-2 text-[11px] text-subtle`,children:e.body})]},e.title))})]})]})]})}export{T as component};