/**
 * Created by Xin on 4/9/16.
 */

export default class CommonUtil {
  static debounce = (fn, wait, immediate)=> {
    let timeout;

    return ()=> {
      const context = this;
      const args = arguments;

      function later() {
        timeout = null;
        if (!immediate) {
          fn.apply(context, args);
        }
      }

      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) {
        fn.apply(context, args);
      }
    };
  };
}
