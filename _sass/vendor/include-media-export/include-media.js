var im = (function() {
  var element = document.body;
  var autoUpdate = true;
  var breakpoints = false;

  function setElement(newElement) {
    element = newElement;
  }

  function setUpdateMode(updateMode) {
    if (updateMode == 'manual') {
      autoUpdate = false;
      readBreakpoints();
    }
  }

  function readBreakpoints() {
    if (window.getComputedStyle && (window.getComputedStyle(element, '::after').content !== '')) {
      var data = window.getComputedStyle(element, '::after').content;

      try {
        breakpoints = JSON.parse(removeQuotes(data));
      } catch (err) {}
    }
  }

  function isBreakpointActive(breakpoint) {
    if (autoUpdate) {
      readBreakpoints();
    }

    return breakpoints.hasOwnProperty(breakpoint) && breakpoints[breakpoint].active;
  }

  function isBreakpointNotActive(breakpoint) {
    return !isBreakpointActive(breakpoint);
  }

  function getActiveBreakpoint() {
    if (autoUpdate) {
      readBreakpoints();
    }

    var largest = {name: false, value: 0};

    for (var breakpoint in breakpoints) {
      if (breakpoints.hasOwnProperty(breakpoint)) {
        var breakpointValue = parseFloat(breakpoints[breakpoint].value);

        if (breakpoints[breakpoint].active && (breakpointValue > largest.value)) {
          largest = {name: breakpoint, value: breakpointValue};
        }
      }
    }

    return largest.name;
  }

  function getBreakpointValue(breakpoint, asNumber) {
    if (autoUpdate) {
      readBreakpoints();
    }

    if (!breakpoints || !breakpoints.hasOwnProperty(breakpoint)) {
      return false;
    }

    return asNumber ? parseFloat(breakpoints[breakpoint].value) : breakpoints[breakpoint].value;
  }

  /**
  *
  * Function by Les James (@lesjames) taken from https://css-tricks.com/making-sass-talk-to-javascript-with-json/
  *
  **/
  function removeQuotes(string) {
    if (typeof string === 'string' || string instanceof String) {
      string = string.replace(/[']/g, '"').replace(/\\|^[\s\S]{0,1}|[\s\S]$/g, '');
    }

    return string;
  }

  return {
    setElement: setElement,
    setUpdateMode: setUpdateMode,
    greaterThan: isBreakpointActive,
    lessThan: isBreakpointNotActive,
    getActive: getActiveBreakpoint,
    getValue: getBreakpointValue,
    update: readBreakpoints
  };
})();
