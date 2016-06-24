  $(document).ready(function() {
    var quesNum = null;
    $.getJSON("./data/ToS.json", function(json) {
      quesNum = json.data.length;
      $.each(json.data, function(index, obj) {
       $("#questions").append(questionHtml(index + 1, obj.title, obj.name));
      });
    });

    $("#submitbutton").on("click", function(){

      $("#submitbutton").attr("disabled", "disabled");

      var myname = $("#namefield").val();
      var req = $("#output").rplot("random_forest");

      req.fail(function(){
        alert("Server error: " + req.responseText);
      });

      req.always(function(){
        $("#submitbutton").removeAttr("disabled");
      });
    });

    $("#predictButton").on("click", function(){
        $("#predictButton").attr("disabled", "disabled");
        ocpu.rpc("precision", {}, function(output) {
        //console.log(output.message);
        $("#check_rate").css("display","block").text("準確率：" + Math.round(output.message * 100) + "%");
        $("#predictButton").removeAttr("disabled");
      });
    });

    $("#randomButton").on("click", function(){
      $("li").each(function(index, el){
        var randNum = (index === 0) ? Math.floor((Math.random() * 2))  : Math.floor((Math.random() * 5));
        var radio = $(el).find("input[type='radio']")[randNum];
        $(radio).prop("checked", true);
      });
    });

    $("#paid").on("click", function() {
      if($("input[type='radio']:checked").length < quesNum) {
        $("#result").html("<div class='alert alert-danger' role='alert'>尚未做答完畢！</div>");
        return false;
      }

      var answer = [{}];
      $("input:checked").map(function() {
        answer[0][this.name] = (this.name !== "gender") ? parseInt(this.value) : this.value;
      });

      $("#paid").attr("disabled", "disabled");

      ocpu.rpc("paid", {arg1: JSON.stringify(answer)}, function(output) {
        console.log(output);
        var flag = "alert-danger";
        if(output == "TRUE") {
          flag = "alert-success";
        }
        var result = (output == "TRUE") ? "預測結果為付費"  : "預測結果為非付費";
        $("#result").html("<div class='alert "+ flag + "' role='alert'>"+ result +"</div>");
        $("#paid").removeAttr("disabled");
      });
    });

    function questionHtml(index, title, name) {
      var radioGroup;
      if(name == "gender") {
        radioGroup = "<input type='radio' name='" + name + "' value='male' /><label>male</label>" +
                     "<input type='radio' name='" + name + "' value='female' /><label>female</label>";
      }
      else {
        radioGroup = "<input type='radio' name='" + name + "' value='1' /><label>1</label>" +
                     "<input type='radio' name='" + name + "' value='2' /><label>2</label>" +
                     "<input type='radio' name='" + name + "' value='3' /><label>3</label>" +
                     "<input type='radio' name='" + name + "' value='4' /><label>4</label>" +
                     "<input type='radio' name='" + name + "' value='5' /><label>5</label>";
      }
      var html = "<li class='list-group-item'>" +
                    "<div class='clearfix'>" +
                      "<label>" + index + "." + title + "</label>" +
                      "<span id='radioGroup'>" + radioGroup + "</span>" +
                    "</div>" +
                 "</li>";
      return html;
    }
  });
