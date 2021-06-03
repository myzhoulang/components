import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import 'antd/es/upload/style';
import _Upload from 'antd/es/upload';
import 'antd/es/message/style';
import _message from 'antd/es/message';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
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
    /*#__PURE__*/ _regeneratorRuntime.mark(function _callee(file, oss) {
      var ext;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
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
    _message.error(
      ''.concat(file.name, ' \u6587\u4EF6\u683C\u5F0F\u4E0D\u6B63\u786E'),
    );

    return _Upload.LIST_IGNORE;
  }

  if (!isSize) {
    _message.error(
      ''
        .concat(file.name, ' size \u4E0D\u80FD\u5927\u4E8E ')
        .concat(
          conf === null || conf === void 0 ? void 0 : conf.signSize,
          ' KB',
        ),
    );

    return _Upload.LIST_IGNORE;
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
