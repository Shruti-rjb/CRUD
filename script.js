let tbody = document.querySelector("tbody");
let addBtn = document.querySelector(".add");
let form = document.querySelector(".form-wrapper");
let saveBtn = document.querySelector(".save");
let cancelBtn = document.querySelector(".cancel");

let nameEl = document.querySelector("#name");
let categoryEl = document.querySelector("#category");
let descriptionEl = document.querySelector("#description");
let createdByEl = document.querySelector("#createdBy");
let statusEl = document.querySelector("#status");

let httpm = null;

let url = "https://product-fhqo.onrender.com/products/";

let objectData = [];

let id = null;

let data = {};

addBtn.onclick = function () {
  httpm = "POST";
  clearForm();
  form.classList.add("active");
};

cancelBtn.onclick = function () {
  form.classList.remove("active");
};

saveBtn.onclick = function () {
  data.name = nameEl.value;

  data.category = categoryEl.value;
  data.description = descriptionEl.value;
  data.createdBy = createdByEl.value;

  data.status = statusEl.value;

  if (httpm == "PATCH") {
    data.id = id;
    url += data.id;
  }

  fetch(url, {
    method: httpm,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    clearForm();
    form.classList.remove("active");
    getProducts();
  });
};

function clearForm() {
  nameEl.value = null;
  categoryEl.value = null;
  descriptionEl.value = null;
  createdByEl.value = null;
  statusEl.value = null;
}

function getProducts() {
  fetch(url)
    .then((response) => {
      //console.log(response);
      return response.json();
    })
    .then((data) => {
      //console.log(data.products);
      objectData = data.products;
      updateProducts();
    });
}

getProducts();

function updateProducts(filterData) {
  let data = "";
  let filter = filterData?.length > 0 ? filterData : objectData;

  if (filter.length > 0) {
    for (i = 0; i < filter.length; i++) {
      data += `
                    <tr id = "${filter[i]["id"]}">
            
                    <td>${filter[i]["product_name"]}</td>
                    <td>${filter[i]["category_name"]}</td>
                    <td>${filter[i]["description"]}</td>
                    <td>${filter[i]["created_by"]}</td>
                    <td>${filter[i]["status"]}</td>
                    <td><button type="button" class="btn btn-success" onclick="editProduct(event)">Edit</button></td>
                    <td><button type="button" class="btn btn-danger" onclick="deleteProduct(event)">Delete</button></td>
                     </tr>
            `;
    }
    tbody.innerHTML = data;
  }
}

//----edit product----
function editProduct(e) {
  form.classList.add("active");
  httpm = "PATCH";
  id = e.target.parentElement.parentElement.id;
  let selectedProduct = objectData.filter((p) => {
    return p["id"] == id;
  })[0];
  nameEl.value = selectedProduct.product_name;
  categoryEl.value = selectedProduct.category_name;
  descriptionEl.value = selectedProduct.description;
  createdByEl.value = selectedProduct.created_by;
  statusEl.value = selectedProduct.status;
}

//----delete product---

function deleteProduct(e) {
  id = e.target.parentElement.parentElement.id;
  fetch(url + "/" + id, { method: "DELETE" }).then(() => {
    console.log("Deleted Successfully");
    getProducts();
  });
}

//Search

let filterData = [];
let newarray = [];
document.getElementById("search").addEventListener("keyup", function (e) {
  let search = this.value.toLowerCase();

  console.log(objectData, "dfdf");

  newarray = objectData.filter(function (val) {
    if (
      val.product_name.toLowerCase().includes(search) ||
      val.category_name.toLowerCase().includes(search) ||
      val.description.toLowerCase().includes(search) ||
      val.created_by.toLowerCase().includes(search) ||
      val.status.toLowerCase().includes(search)
    ) {
      // let newobj = {
      //   name: val.product_name,
      //   category: val.category_name,
      //   description: val.description,
      //   createdBy: val.created_by,
      //   status: val.status,
      // };
      // return newobj;
      console.log(typeof val.product_name, "fsfs");

      return val;
    }
  });
  console.log(newarray, "new");
  filterData = newarray;
  updateProducts(filterData);
});
