Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new DOMException('Storage disabled for regression test','SecurityError');}});
