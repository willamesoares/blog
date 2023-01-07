import React, { useEffect } from 'react'

import { ScriptConfig } from '~/types/script-config.type';

const CommentSection = (): JSX.Element => {
  const rootElm = React.createRef<HTMLDivElement>()
  
  useEffect(() => {
    const script = document.createElement('script')
    const scriptConfig: ScriptConfig = {
      src: 'https://utteranc.es/client.js',
      repo: 'willamesoares/blog',
      theme: "icy-dark",
      label: 'blog post comments',
      async: true,
      'issue-term': 'title',
      crossOrigin: 'anonymous',
    }
    
    Object.keys(scriptConfig).forEach((configKey) => {
      script.setAttribute(configKey, (
        scriptConfig as unknown as Record<string, string> // look into how to do this properly
      )[configKey]);
    });

    rootElm.current?.appendChild(script);
  }, [rootElm]);
    
  return <div ref={rootElm} />;
}
  
export default CommentSection;