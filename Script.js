let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let create = document.getElementById('create');
let deleteAll = document.getElementById('deleteBtn');
let searchBtn = document.getElementById('magnifier');
let search = document.getElementById('search');
let Error = document.getElementById('errors');
let theme = document.getElementById('theme');
let currentItem;
let errors = [];

if(localStorage.getItem("Mode")==null)
{
  theme.innerHTML=`<i id='icon' onclick='DarkMode()' class="moon fa-solid fa-moon"></i>`
}
else if(localStorage.getItem("Mode")==="Dark")
{
  document.body.classList.toggle("dark-theme");
  theme.innerHTML=`<i id='icon' onclick='DarkMode()' class="sun fa-solid fa-sun"></i>`
}
else{
  theme.innerHTML=`<i id='icon' onclick='DarkMode()' class="moon fa-solid fa-moon"></i>`
}

// Dark Mode
function DarkMode() {
  document.body.classList.toggle("dark-theme");
  if(document.body.classList.contains("dark-theme"))
  {
    theme.innerHTML=`<i id='icon' onclick='DarkMode()' class="sun fa-solid fa-sun"></i>`
    localStorage.setItem("Mode","Dark");
  }
  else
  {
    theme.innerHTML=`<i id='icon' onclick='DarkMode()' class="moon fa-solid fa-moon"></i>`
    localStorage.setItem("Mode","Light");
  }

}

function getTotal() {
  let sum =
    parseInt(price.value)
    + parseInt(taxes.value)
    + parseInt(ads.value);

  if(!isNaN(parseInt(discount.value)))
    sum -= parseInt(discount.value);

  if(isNaN(sum))
  {
    total.innerHTML = " ";
    total.style.backgroundColor = '#A30000';
  }
  else{
    total.innerHTML = String(sum);
    total.style.backgroundColor = '#49a300' ;
  }
}

// Create Product
let products;
if(localStorage.Products != null)
  products = JSON.parse(localStorage.getItem('Products'));
else
  products =[];

create.onclick = ()=>{
  // products.push()
  if(Validate()) {
    if (create.innerHTML === "Update") {
      products[currentItem] = {
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value,
      }
      count.style.display = 'inline-block'
      create.innerHTML = 'Create';
    } else {
      for (let i = 0; i < count.value; i++) {
        products[products.length] = {
          title: title.value,
          price: price.value,
          taxes: taxes.value,
          ads: ads.value,
          discount: discount.value,
          total: total.innerHTML,
          count: count.value,
          category: category.value,
        }
      }
    }
    //Save localstorage
    localStorage.setItem("Products", JSON.stringify(products));
    Error.innerHTML = " ";
    Error.style.display = "none";
    getData();
    clearData();
  }else{
    let messages= '';
    for(let i =0;i<errors.length;i++)
    {
      messages+=
      `
        <div style="
                  background-color:#F8D7DA;
                  color: #93205C;
                  margin-bottom: 3px;
                  border: 2px solid #c5363d;
                  padding: 6px;
                  border-radius: 3px;
                  font-weight: bold;
                  font-size: 15px;
                  ">
          ${errors[i]}
        </div>
      `
    }
    Error.style.width='100%';

    Error.innerHTML = messages;
    errors.splice(0);
  }
  // window.location.reload();
}

// clear inputs
function clearData(){
    title.value = ""
    price.value = ""
    taxes.value = ""
    ads.value = ""
    discount.value = ""
    total.innerHTML= ""
    count.value = ""
    category.value = ""
    total.style.backgroundColor = '#A30000';
}

//Read Products
function getData(){
  let table = '';
  for(let i=0;i<products.length;i++){
    table +=
      `
        <tr>
          <td>${i+1}</td>
          <td>${products[i].title}</td>
          <td>${products[i].price}</td>
          <td>${products[i].taxes}</td>
          <td>${products[i].ads}</td>
          <td>${products[i].discount}</td>
          <td>${products[i].total}</td>
          <td>${products[i].category}</td>
          <td><button onclick="update(${i})" id="update">update</button></td>
          <td><button onclick="Delete(${i})" id="delete">delete</button></td>
        </tr>
      `
  }
  document.getElementById('tbody').innerHTML= table;
  if(products.length)
    deleteAll.innerHTML = `<button onclick='DeleteAll()' style='margin-bottom: 0' class='deleteAll'>delete all (${products.length})</button>`
  else
    deleteAll.innerHTML = " ";
}
getData();

// Delete Product
let Delete = (id)=>{
  products.splice(id,1);
  localStorage.Products = JSON.stringify(products);
  getData();
}

// Delete All Product
let DeleteAll = ()=>{
  // localStorage.removeItem('Products');
  localStorage.clear();
  products.splice(0);
  window.location.reload();
  // getData();
}

// Update Product
let update = (id)=>{
  title.value = products[id].title;
  price.value = products[id].price
  taxes.value = products[id].taxes
  ads.value = products[id].ads
  discount.value = products[id].discount
  category.value = products[id].category
  getTotal();
  count.style.display = 'none'
  create.innerHTML = 'Update';
  currentItem=id;
  scroll({
      top:0,
      behavior:"smooth"
    }
  )
}

// Search Product
searchBtn.onclick= ()=>{
  let result = '';
  let itemCount;
  let value = search.value.toLowerCase();
  let found = false;
  for(let i=0;i<products.length;i++){
    if(products[i].title.toLowerCase().includes(value) || products[i].category.toLowerCase().includes(value))
    {
      found = true;
      result +=
        `
          <tr>
            <td>${i+1}</td>
            <td>${products[i].title}</td>
            <td>${products[i].price}</td>
            <td>${products[i].taxes}</td>
            <td>${products[i].ads}</td>
            <td>${products[i].discount}</td>
            <td>${products[i].total}</td>
            <td>${products[i].category}</td>
            <td><button onclick="update(${i})" id="update">update</button></td>
            <td><button onclick="Delete(${i})" id="delete">delete</button></td>
          </tr>
        `
      itemCount = i+1;
    }
  }
  deleteAll.innerHTML = `<button onclick='DeleteAll()' style='margin-bottom: 0' class='deleteAll'>delete all (${itemCount})</button>`
  if(found)
    document.getElementById('tbody').innerHTML= result;
  else
  {
    search.value = '';
    getData();
  }
}
search.onclick = ()=>{
  if(search.value !== "")
  {
    getData();
  }
}

// Validate Inputs
function Validate(){

  if(title.value ==="")
    errors.push("Title can\'t be empty");
  else
    if (title.value.length > 20)
      errors.push("Title should be short");

  if(price.value ==="")
    errors.push("Price can\'t be empty");

  if(taxes.value ==="")
    errors.push("Taxes can\'t be empty");

  if(ads.value ==="")
    errors.push("Ads can\'t be empty");

  if(count.value === "")
    errors.push("Count can\'t be empty");
  else
    if(count.value >50)
      errors.push("Can\'t create greater than 50 product one time");

  if(category.value ==="")
    errors.push("Category can\'t be empty");

  if(create.innerHTML === "Update")
    errors.splice(errors.length-1,1)

  return errors.length === 0;
}