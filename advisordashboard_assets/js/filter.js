
var userSectionIdArray = [];
var userGradeArray = [];
var userPercentageArray = [];

// jquery to make studentTable paginated
$(function () {
  $("#studentTable").dataTable({ "pagingType": "full_numbers" });

})

// jquery to copy the studentTable data into otable variable
$(function () {
  otable = $('#studentTable').dataTable();
})

// on change of show grades this function gets invoked
function gradeHide() {

  // if the show grade checkbox is not checked, grades column is disabled and all the grades A,B,C,D,F are hidden
  if (document.getElementById("gradecheck").checked == false) {
    var table = $('#studentTable').DataTable();
    table.columns('.hideGrade').visible(false);
    $("#gradeCheckbox").hide();
  } else {
    // if the show grade checkbox is checked, grades column is enabled and all the grades A,B,C,D,F are shown
    var table = $('#studentTable').DataTable();
    table.columns('.hideGrade').visible(true);
    $("#gradeCheckbox").show();
  }
}

// on load of index.ejs this function is invoked and if show grades is checked then enables the grades column else disable the grades column        
$(document).ready(function () {
  if ($('#gradecheck').prop('checked')) {
    var table = $('#studentTable').DataTable();
    table.columns('.hideGrade').visible(true);
  } else {
    var table = $('#studentTable').DataTable();
    table.columns('.hideGrade').visible(false);
  }
});

// on change of the any grades this function is invoked to filter the data in the studentTable
function filterGrades() {

  //build a regex filter string with an or(|) condition
  var grade = $('input:checkbox[name="grade"]:checked').map(function () {
    return '^' + this.value + '\$';
  }).get().join('|');

  //filter in column 0, with an regex, no smart filtering, no inputbox,not case sensitive
  otable = $('#studentTable').dataTable();
  otable.fnFilter(grade, 4, true, false, false, false);
}


