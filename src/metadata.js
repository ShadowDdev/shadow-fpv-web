export const routeMeta={
 '/':['Built for the flight','Shadow FPV Technology develops electronics for FPV hobby drones. Explore flight controllers, ESCs, receivers and our hardware roadmap.'],
 '/products':['FPV hardware','Browse Shadow FPV flight controllers, ESCs, receivers, planned motors and frames. Explore models and development information.'],
 '/privacy':['Privacy policy','How Shadow FPV Technology handles local browser storage and your enquiries.'],
 '/terms':['Terms of service','Terms for using the Shadow FPV Technology pre-launch website.'],
 '/refunds':['Refund & return policy','Current order status and pre-launch return information for Shadow FPV Technology.'],
 '/cookies':['Cookie policy','Learn about theme preferences, optional local storage and the absence of tracking cookies.'],
 '/business':['Business information','Contact Shadow FPV Technology in India for hardware, website and privacy enquiries.'],
 '/accessibility':['Accessibility','Accessibility features and ways to report difficulties using Shadow FPV Technology.'],
 '/data-deletion':['Data deletion','Remove your local demo email or contact Shadow FPV Technology about personal information.']
};
for(const [slug,name] of [['fc','FC'],['esc','ESC'],['rx','RX'],['motor','Motor'],['frame','Frame']])routeMeta['/products/shadow-'+slug]=['Shadow '+name,'Explore the Shadow '+name+' hardware project, model viewer, proposed kit contents and development status.'];
export function applyMetadata(path){const found=routeMeta[path];document.title=(found?.[0]||'Page not found')+' — Shadow FPV Technology';document.querySelector('meta[name="description"]')?.setAttribute('content',found?.[1]||'This page could not be found. Return to Shadow FPV Technology.');let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical);}canonical.href='https://shadowddev.com'+path;return !!found;}
