function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  var _i =
    arr &&
    ((typeof Symbol !== 'undefined' && arr[Symbol.iterator]) ||
      arr['@@iterator']);
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

import { message, Upload } from 'antd';
import SparkMD5 from 'spark-md5';
export var noop = function noop() {}; // 默认获取 oss 配置方法
// 当需要获取oss配置数据的时候，只提供了一个获取 oss 配置的 api 时使用

var getOSSDataForAction = function getOSSDataForAction(url, header) {
  return fetch(url, {
    headers: header,
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      return data.data;
    });
};
/**
 * 获取文件的md5值，用作文件名称
 * @param file 要上传的文件
 * @returns 文件的 MD5
 */

var getMD5 = function getMD5(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    var spark = new SparkMD5.ArrayBuffer();
    reader.readAsArrayBuffer(file);

    reader.onload = function (e) {
      if (e.target) {
        spark.append(e.target.result);
      }

      resolve(spark.end());
    };

    reader.onerror = function (e) {
      reject(e);
    };
  });
};
/**
 * 获取文件上传到OSS的配置
 * @returns Promise<IOSSData> OSS 配置
 * getOSSData > OSSAction > OSSData
 */

var getSignature = function getSignature(oss) {
  var getOSSData = oss.getOSSData,
    OSSData = oss.OSSData,
    OSSAction = oss.OSSAction,
    OSSHeader = oss.OSSHeader; // 没有提供 OSS 配置数据  并且 没有获取 OSS 配置数据的方法 并且也没有获取 OSSAction 的服务器地址
  // 就认为 获取不到 OSS 配置数据就认为获取 OSS 配置失败

  if (typeof getOSSData !== 'function' && !OSSData && !OSSAction) {
    return Promise.reject({
      message: '缺少OSS数据或获取OSS数据的方法或缺少获取OSS配置的服务器地址',
    });
  }

  if (typeof getOSSData === 'function') {
    return getOSSData()
      .then(function (data) {
        return data;
      })
      .catch(function (e) {
        console.error(e);
        return Promise.reject(e);
      });
  } else if (typeof OSSAction === 'string') {
    return getOSSDataForAction(OSSAction, OSSHeader);
  }

  return OSSData ? Promise.resolve(OSSData) : Promise.reject('缺少OSS数据');
};

export var getExtraData = /*#__PURE__*/ (function () {
  var _ref = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee(file, oss) {
      var ext;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              ext = file.name.substr(file.name.lastIndexOf('.'));
              return _context.abrupt(
                'return',
                Promise.all([getMD5(file), getSignature(oss)])
                  .then(function (_ref2) {
                    var _ref3 = _slicedToArray(_ref2, 2),
                      md5 = _ref3[0],
                      oss = _ref3[1];

                    var dir = oss.dir,
                      host = oss.host,
                      accessId = oss.accessId,
                      policy = oss.policy,
                      signature = oss.signature,
                      callback = oss.callback;
                    var path = ''.concat(dir).concat(md5).concat(ext);
                    file.server_url = ''
                      .concat(host, '/')
                      .concat(dir)
                      .concat(md5)
                      .concat(ext);
                    return {
                      host: host,
                      path: path,
                      key: path,
                      OSSAccessKeyId: accessId,
                      policy: policy,
                      Signature: signature,
                      callback: callback,
                    };
                  })
                  .catch(function (e) {
                    console.log(e);
                  }),
              );

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee);
    }),
  );

  return function getExtraData(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

var getFileExtendingName = function getFileExtendingName() {
  var filename =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var ext = filename.slice(filename.lastIndexOf('.') + 1);

  if (ext) {
    return ext.toLocaleLowerCase();
  }

  return '';
};

export var uploadValid = function uploadValid(file, config) {
  var _conf$exts;

  var conf = Object.assign(
    {
      exts: [],
      signSize: 200,
      multiple: false,
    },
    config,
  );
  var ext = getFileExtendingName(file.name);
  var isType =
    conf === null || conf === void 0
      ? void 0
      : (_conf$exts = conf.exts) === null || _conf$exts === void 0
      ? void 0
      : _conf$exts.includes(ext);
  var isSize =
    file.size / 1024 <
    (conf === null || conf === void 0 ? void 0 : conf.signSize);

  if (!isType) {
    message.error(
      ''.concat(file.name, ' \u6587\u4EF6\u683C\u5F0F\u4E0D\u6B63\u786E'),
    );
    return Upload.LIST_IGNORE;
  }

  if (!isSize) {
    message.error(
      ''
        .concat(file.name, ' size \u4E0D\u80FD\u5927\u4E8E ')
        .concat(
          conf === null || conf === void 0 ? void 0 : conf.signSize,
          ' KB',
        ),
    );
    return Upload.LIST_IGNORE;
  }

  return true;
}; // 将 url 转换成 path + search + hash

var urlToPath = function urlToPath(url) {
  try {
    var u = new URL(url);
    return ''.concat(u.pathname.substr(1)).concat(u.search).concat(u.hash);
  } catch (e) {
    return url;
  }
};

export var getFilePath = function getFilePath(files) {
  if (Array.isArray(files)) {
    return files.map(function (item) {
      if (typeof item === 'string') {
        return urlToPath(item);
      } else {
        return _objectSpread(
          _objectSpread({}, item),
          {},
          {
            url: urlToPath(item.url),
          },
        );
      }
    });
  }

  if (typeof files === 'string') {
    return urlToPath(files);
  }

  if (Object.prototype.toString.call(files) === '[object Object]') {
    return _objectSpread(
      _objectSpread({}, files),
      {},
      {
        url: urlToPath(files.name),
      },
    );
  }

  console.error('获取文件路径失败，请检查 files value的类型');
};
export default {
  getExtraData: getExtraData,
  getFilePath: getFilePath,
};
