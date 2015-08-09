$(function(){
  console.log("hehe first:", $.cookie("language"));
  if (!$.cookie("language")){
    $.cookie("language", "zh", {expires: 7, path: '/', maxAge:31536000000})
    //$.cookie("language", "zh");
  }
  console.log("hehe:", $.cookie("language"));

  if ($.cookie("language") === "en") {
    $("span#en").addClass('cur');
    $("span#ch").removeClass('cur');
  };
});

function changeLang(language) {
  switch (language){
    case 'zh':
      if ($("span.cur").text() != "中文") {
        $.cookie("language", "zh", {expires: 7, path: '/', maxAge:31536000000})
        //$.cookie("language", "zh");
        $("span#ch").addClass('cur');
        $("span#en").removeClass('cur');
        console.log("中文:", $.cookie("language"));
        location.reload();
      }
      break;
    case 'en':
      if ($("span.cur").text() != "ENGLISH") {
        $.cookie("language", "en", {expires: 7, path: '/', maxAge:31536000000});
        //$.cookie("language", "en");
        $("span#en").addClass('cur');
        $("span#ch").removeClass('cur');
        console.log("英语:", $.cookie("language"));
        location.reload();
      };
      break;
    default:
      return;
  };
};
