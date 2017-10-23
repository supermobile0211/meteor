import http from 'https';
import url from 'url';
import async from 'async';
import string_decoder from 'string_decoder';
var key = 'trnsl.1.1.20160225T190748Z.c144dbf9e8a68a67.0cf93f1d933872fd08d7c5ab78e2d7cbd9f699b3'
    , StringDecoder = string_decoder.StringDecoder
    , decoder = new StringDecoder('utf8');

var getOptions = function(msg, cb){
    return {
        host: 'translate.yandex.net/api/v1.5/tr.json/translate',
        query: {
            key: key,
            text: msg.text,
            lang: msg.from + '-' + msg.to
        }
    };
};
var formatUrl = function(options){
    return url.format(options);
};
var getLink = function(link,cb){
    try{
        var request = http.get('https:'+link, function(response) {
            var str = '';
            response.on('data', function (chunk) {
                str += decoder.write(chunk);
            });
            response.on('end', function () {
                cb(str);
            });
            response.on('error', function (err) {
                cb(err);
            });
        });
        request.on('error', function(err){
            console.log(err);
        })
    }catch(err){
        cb(err);
    }
};
var checkText = function(text){
    if(typeof text != 'string'){
        return 'text passed is not a string'
    }
    return false;
};
var checkFrom = function(from){
    if(typeof from != 'string'){
        return 'language to translate from is not a string'
    }
    return false;
};
var checkLanguages = function(languages){
    if(!languages || !languages.length){
        return 'no output languages specified'
    }
    for(lang in languages){
        if(typeof lang != 'string'){
            return 'output languages should be an array of strings'
        }
    }

};
var yandexTranslate = {
    getAllLanguages : function(text, from, languages, cb){
        var TextC = checkText(text);
        if(TextC){
            return cb(TextC);
        }
        var FromC = checkFrom(from);
        if(FromC){
            return cb(FromC);
        }
        var LanguagesC = checkLanguages(languages);
        if(LanguagesC){
            return cb(LanguagesC);
        }
        var data = {};
        async.forEach(languages, function(lang, callback){
            if(lang != from){
                var msg = getOptions({
                    text:text,
                    from: from,
                    to: lang
                });
                var link = formatUrl(msg);
                getLink(link, function(results){
                    //console.log(results.text);
                    try {
                        results = JSON.parse(results);
                    }catch(e){

                    }
                    results.text[0] = (results.text[0]);
                    data[lang] = results;
                    callback();
                });

            }else{
                callback();
            }
        }, function(){
            cb(null, data);
        })
    }
};

module.exports=yandexTranslate;