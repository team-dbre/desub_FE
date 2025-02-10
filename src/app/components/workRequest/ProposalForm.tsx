import Script from 'next/script';

const ProposalForm = () => {
  return (
    <>
      <iframe
        data-tally-src="https://tally.so/embed/wgJrgN?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        loading="lazy"
        width="100%"
        height="2344"
        title="제안서(proposal)"
      />
      <Script id="tally-proposal">
        {`
            var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}
          `}
      </Script>
    </>
  );
};

export default ProposalForm;
