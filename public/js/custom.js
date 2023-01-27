$(".profileBtn").click(function () {
  $(".drp").toggle({ display: "block" });
});

$("h1").addClass("alert alert-primary");

// $(".active a").attr("href", "index.html");
const suggebox = document.querySelector("#studentList");

async function searchStudent(input, URL) {
  if (input.value) {
    suggebox.setAttribute("class", "show");

    // const StudentId = input.value;
    const data = await fetch(URL, {
      method: "POST",
    });
    const getStudents = await data.json();
    srudents = getStudents.map((data) => {
      return (data = `<li><a href="/student/view/${data._id}"><img class="rounded-circle searchImg" src="${data.image}" alt="">${data.name} <strong id='price_in_search'> ${data.studentId}</strong></a></li>`);
    });
    showsugg(srudents);
  } else {
    suggebox.setAttribute("class", "hide");
  }
}

function showsugg(list) {
  let listData;
  if (!list.length) {
    listData = `<li>No Result found</li>`;
  } else {
    listData = list.join("");
  }
  suggebox.innerHTML = listData;
}
