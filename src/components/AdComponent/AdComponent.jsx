/* global adsbygoogle */

import React, { useEffect, useRef } from 'react';

const AdComponent = () => {
    const adRef = useRef();

    useEffect(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error('Error loading adsbygoogle script:', error);
        }
    }, []);

    return (
        <ins className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-9704083006647691"
            data-ad-slot="6491375208"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
    );
};

export default AdComponent;
