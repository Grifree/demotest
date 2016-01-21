'use strict'
var util = {
    // 增加 split 参数
    namespace: function (name, holder, split) {
        var o, j, p
        var split = split || '.'
        if (typeof name === 'object') {
            p = name
        }
        else {
            p = name.split(split)
        }
        var o = holder
        for (j = 0; j < p.length; ++j) {
            o = o[p[j]] = o[p[j]] || {}
        }
        return o
    },
    // source: https://github.com/zaach/jsonlint/blob/master/lib/formatter.js
    formatJson: function (json, indentChars) {
        function repeat(s, count) {
            return new Array(count + 1).join(s);
        }
        var i           = 0,
          il          = 0,
          tab         = (typeof indentChars !== "undefined") ? indentChars : "    ",
          newJson     = "",
          indentLevel = 0,
          inString    = false,
          currentChar = null;

        for (i = 0, il = json.length; i < il; i += 1) { 
          currentChar = json.charAt(i);

          switch (currentChar) {
          case '{': 
          case '[': 
              if (!inString) { 
                  newJson += currentChar + "\n" + repeat(tab, indentLevel + 1);
                  indentLevel += 1; 
              } else { 
                  newJson += currentChar; 
              }
              break; 
          case '}': 
          case ']': 
              if (!inString) { 
                  indentLevel -= 1; 
                  newJson += "\n" + repeat(tab, indentLevel) + currentChar; 
              } else { 
                  newJson += currentChar; 
              } 
              break; 
          case ',': 
              if (!inString) { 
                  newJson += ",\n" + repeat(tab, indentLevel); 
              } else { 
                  newJson += currentChar; 
              } 
              break; 
          case ':': 
              if (!inString) { 
                  newJson += ": "; 
              } else { 
                  newJson += currentChar; 
              } 
              break; 
          case ' ':
          case "\n":
          case "\t":
              if (inString) {
                  newJson += currentChar;
              }
              break;
          case '"': 
              if (i > 0 && json.charAt(i - 1) !== '\\') {
                  inString = !inString; 
              }
              newJson += currentChar; 
              break;
          default: 
              newJson += currentChar; 
              break;                    
          } 
        } 

        return newJson; 
    },
    checkUrl: function (url) {
        if (!url) {
            console.log('settings.url is empty!'.red)
            return false
        }
        // settings.url:
        // "/ajax/demo/  "
        //  ↓ ↓ ↓ ↓
        // "/ajax/demo/"
        url = url.trim()

        // settings.url is ""
        if (url === '') {
            console.log('------- Trace -------'.grey)
            console.trace('settings.url is empty string!')
            console.log('-------- url --------'.grey)
            console.log('url: ""')
            console.log('--------------------'.grey)
            console.log('settings.url is empty string!'.red)
            console.log('--------------------'.grey)
            return false
        }
        if (url.charAt(0) !== '/') {
            var sTrueUrl = '/' + url
            //settings.url:
            // demo
            // ↓ ↓ ↓
            // /demo
            console.log(('settings.url:' + settings.url + ' ==> ' + sTrueUrl).yellow)
            settings.url = sTrueUrl
        }
        return url
    },
    // ref: https://github.com/nuysoft/Mock/blob/master/src/util.js#L116-L124
    heredoc: function (fn) {
        // 1. 移除起始的 function(){ /*!
        // 2. 移除末尾的 */ }
        // 3. 移除起始和末尾的空格
        return fn.toString()
            .replace(/^[^\/]+\/\*!?/, '')
            .replace(/\*\/[^\/]+$/, '')
            .replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '') // .trim()
    }
}

module.exports = util