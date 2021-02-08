import { initializeBlock } from '@airtable/blocks/ui';
import React, { useState } from 'react';

import Main from './components/Main'






function HelloWorldApp() {
   return <Main/>
}

initializeBlock(() => <HelloWorldApp />);



