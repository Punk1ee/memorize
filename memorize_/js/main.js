/**
 * Created by punkLee on 17/10/25.
 */


$(function () {
    var myMemorandum = new Memorandum();
    myMemorandum.indexFunction();
    myMemorandum.infoFunction();
});

function Memorandum() {
    //一.获取dom元素
    var $indexWrite = $(".indexWrite");
    var $delete = $(".delete");
    var $infoPage = $(".info-page");
    var $backIndex = $(".back-wrap");
    var $save = $(".save");
    var $info = $("#info");
    var $markUl = $(".mark");
    var $edit = $(".edit");
    var $title = $(".title");
    var $memoCount = $(".count");
    var infoIdx = 0;

    //二.index界面函数及其功能项
    this.indexFunction = function () {
        //1.点击write按钮，展开编写页面
        $indexWrite.on("click", function () {
            $infoPage.addClass("toInfoPage");
            $infoPage.removeClass("toIndexPage");
        });

        //2.创建index默认页面存储的信息
        //a.从本地服务器取出数据
        var arrInfo = null;
        if (!localStorage.info) {
            return;
        } else {
            arrInfo = JSON.parse(localStorage.info);
        }

        //b.通过循环本地数据库中数据的条数来创建li的个数来新建index页面的info信息的条数
        var arrInfo_length = arrInfo.length;
        for (var i = 0; i < arrInfo_length; i++) {

            var IndexIdx = arrInfo[i].numFlag;
            //新建dom节点
            $markUl.append("<li class='mark-li false' numFlag=" + IndexIdx + ">\n" +
                "                <span class='select'></span>\n" +
                "                <p class='content' numFlag= " + IndexIdx + "></p>\n" +
                "                <p class='date' numFlag= " + IndexIdx + "></p>\n" +
                "            </li>");
            $("p.content").eq(i).text(arrInfo[i].content);
            $("p.date").eq(i).text(arrInfo[i].date);
        }
        //c更新备忘录个数
        if (arrInfo_length !== 0) {
            $memoCount.text(arrInfo_length + "个备忘录");
        } else {
            $memoCount.text("无备忘录");
        }

        //3.为indexPage设置点击事件
        //a.判断index页面是否存在有保存的文本
        if (arrInfo_length === 0) {
            return;
        } else {
            $edit.addClass("font-active");

            //a>.为编辑按钮设置点击事件
            $edit.off("click").on("click", function () {
                clickEdit($(this));
            });

            //b>.为选择按钮设置点击事件
            var $select = $(".select");
            $select.off("click").on("click", function () {
                clickSelect($(this));
            });

            //e>.为删除按钮设置点击事件
            $delete.off("click").on("click", function () {
                clickDelete($(this));
            });

            //f>.点击修改内容事件
            var $markLi = $("li");
            $markLi.off("click").on("click",function () {
                remarkInfo($(this));
                console.log($(this).children(".content").text());
            });
        }
    };

    //三.info界面函数及其功能项
    this.infoFunction = function () {

        //1.点击返回按钮，回到主界面
        $backIndex.on("click", function () {
            $infoPage.addClass("toIndexPage");
            $infoPage.removeClass("toInfoPage");
        });

        //2.为保存按钮设置动态样式
        $info.on("input", function () {
            var infoValue = $info.val();
            if (infoValue === "") {
                $save.removeClass("font-active");
            } else {
                $save.addClass("font-active");
            }
        });

        //3.点击保存按钮，将输入的信息存储到本地，再通过本地服务器加载到index页面
        $save.on("click", function () {

            //获取本次点击时，输入框的值，进行判断
            var thisClickValue = $info.val();
            if (thisClickValue === "") {
                return;
            } else {

                //1>.将点击时的输入框的内容，点击保存时的时间，和本条信息在备忘录中的idx打包存放在一个对象中
                var date = new Date();
                var thisClickDate = date.toLocaleDateString() + " " + date.toLocaleTimeString().slice(2);

                var thisInfo = {
                    "content"   : thisClickValue,
                    "date"      : thisClickDate,
                    "numFlag"   : ++infoIdx

                };

                //2>.向本地服务器存储数据信息
                //判断本地是否存在有用户信息，如果存在，则根据本地数据库初始化存储用户的数组
                var arrInfo = null;
                if (localStorage.info) {
                    arrInfo = JSON.parse(localStorage.info);
                } else {
                    arrInfo = [];
                }

                //a>.判断本次输入的值是新建的还是修改的

                arrInfo.push(thisInfo);
                localStorage.info = JSON.stringify(arrInfo);

                //3>清空输入框中已经输入的信息
                $info.val("");

                //4>将本次存储的数据加载到index页面中
                $markUl.append("<li class='mark-li false' numFlag=" + infoIdx + "\">\n" +
                    "                <span class='select'></span>\n" +
                    "                <p class='content' numFlag= " + infoIdx + "></p>\n" +
                    "                <p class='date' numFlag= " + infoIdx + "></p>\n" +
                    "            </li>");
                for (var i = 0; i < arrInfo.length; i++) {
                    $("p.content").eq(i).text(arrInfo[i].content);
                    $("p.date").eq(i).text(arrInfo[i].date);
                }

                //5>为index页面编辑按钮设置样式
                $edit.addClass("font-active").removeClass("origin");

                //6>.为index页面底部count按钮设置内容
                $memoCount.text(arrInfo.length + "个备忘录");

                //7>回到indexPage
                $infoPage.addClass("toIndexPage");

                //8>判断回到主界面后进行的点击事件
                if ($(".mark-li").length === 0) {
                    return;
                } else {
                    $edit.addClass("font-active");

                    //a>.为编辑按钮设置点击事件
                    $edit.off("click").on("click", function () {
                        clickEdit($(this));
                    });

                    //b>.为选择按钮设置点击事件
                    var $select = $(".select");
                    $select.off("click").on("click", function () {
                        clickSelect($(this));
                    });

                    //e>.为删除按钮设置点击事件
                    $delete.off("click").on("click", function () {
                        clickDelete($(this));
                    });

                    //f>.点击修改内容事件
                    var $markLi = $("li");
                    $markLi.off("click").on("click",function () {
                        remarkInfo($(this));
                    });
                }
            }
        });
    };

    //四.部分通用功能函数

    //1.点击edit函数
    function clickEdit(ident) {
        //1>点击编辑
        if (ident.text() === "编辑") {
            //a.将编辑转换成取消
            ident.text("取消");

            //b.为info信息添加样式
            $("span.select").css("opacity", 1);
            $("p.content").addClass("info-active");
            $("p.date").addClass("info-active");

            //c.改变title的内容
            $title.text("已经选中" + 0 + "项");
        }
        //2>点击取消
        else {
            //a.将取消转换成编辑
            ident.text("编辑");

            //b.为info信息添加样式
            var $select = $(".select");
            $select.css("opacity", 0);
            $select.removeClass("checked");
            $select.text("");
            $("p.content").removeClass("info-active");
            $("p.date").removeClass("info-active");

            //c.改变title的内容
            $title.text("备忘录");

            //d.显示write按钮，并将删除按钮隐藏
            $indexWrite.css("display", "block");
            $delete.css("display", "none");
        }
    }

    //2.点击select的函数
    function clickSelect(ident) {
        //1>.改变select的样式
        if (ident.hasClass("checked")) {
            ident.text("");
            ident.removeClass("checked");
            ident.closest("li").removeClass("true").addClass("false");
        } else {
            ident.text("√");
            ident.addClass("checked");
            ident.closest("li").removeClass("false").addClass("true");
        }

        //2>.通过选择的项数来改变title的内容
        var selectCount = $(".checked").length;
        $title.text("已选中" + selectCount + "项");

        //3>.隐藏write按钮，并将删除按钮呈现出来
        $indexWrite.css("display", "none");
        $delete.css("display", "block");
    }

    //3.点击删除函数
    function clickDelete() {
        //1>.通过类名为true来删除选中的li
        var canBeDeletedLi = $("li.true"),
            canBeDeletedLi_length = canBeDeletedLi.length;
        canBeDeletedLi.remove();

        //2>.删除服务器中的选中的对应的数据
        //a>.从本地服务器取出数据
        var arrInfo = null;
        if (!localStorage.info) {
            return;
        } else {
            arrInfo = JSON.parse(localStorage.info);
        }
        var arrInfo_length = arrInfo.length;
        //b>.删除操作
        for (var i = 0; i < canBeDeletedLi_length; i++) {
            //获取到本条信息的idx
            var deleteIdx = parseInt(canBeDeletedLi.eq(i).attr("numFlag"));

            //然后将列表中的删除的信息的类名true移除,防止canBeDeletedLi_length不能准确获取
            canBeDeletedLi.eq(i).removeClass("true").addClass("false");

            //将选中的本条信息从本地服务器中删除
            for (var j = 0; j < arrInfo_length; j++) {
                if (arrInfo[j].numFlag === deleteIdx) {
                    arrInfo.splice(arrInfo.indexOf(arrInfo[j]), 1);
                    break;
                }
            }
        }
        //c>.将删除过后的信息再重新放回到本地服务器中
        localStorage.info = JSON.stringify(arrInfo);

        //3>.若是信息删除完了，为index页面设置实时更新
        if (arrInfo.length === 0) {
            $edit.addClass("origin").removeClass("font-active");
            $title.text("备忘录");
            $indexWrite.css("display", "block");
            $delete.css("display", "none");
            $memoCount.text("无备忘录");
        } else {
            $memoCount.text(arrInfo.length + "个备忘录");
        }

        //4>还原默认设置
        //a>将edit取消转换成编辑
        $edit.text("编辑");

        //b.为info信息添加样式
        var $select = $(".select");
        $select.css("opacity", 0);
        $select.removeClass("checked");
        $select.text("");
        $("p.content").removeClass("info-active");
        $("p.date").removeClass("info-active");

        //c.改变title的内容
        $title.text("备忘录");

        //d.显示write按钮，并将删除按钮隐藏
        $indexWrite.css("display", "block");
        $delete.css("display", "none");
    }

    //4.点击修改事件
    function remarkInfo(ident) {
        //1.跳转到infoPage
        $infoPage.addClass("toInfoPage");
        $infoPage.removeClass("toIndexPage");

        //2.将本条信息的content返回到输入框内
        $info.val(ident.children(".content").text());

        //3.通过本条被修改的信息的date和本地数据库对比，若是相同的，则替换。
        //a>.从本地服务器取出数据
        var arrInfo = null;
        if (!localStorage.info) {
            return;
        } else {
            arrInfo = JSON.parse(localStorage.info);
        }
        var arrInfo_length = arrInfo.length;
        var identDate = ident.children(".date").text();
        for(var i = 0;i < arrInfo_length;i++){
            if(identDate === arrInfo[i].date){

                //获取到此时输入框内的值
                var thisInfo = $info.val();
            }
        }
    }


}




