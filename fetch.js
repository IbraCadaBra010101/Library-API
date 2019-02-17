//reusable recursive function //setting default parameters
const doRecursiveRequest = (url, limit=15,counter = 0) =>
    fetch(url).then(res => res.json())
        .then(obj => {
            if (obj.status === 'error' && limit > -1) {

                let output_tries = document.getElementById('tries-output');
                output_tries.innerText = 'Amount of failed requests: ' + counter + '. There are ' + limit + ' request tries left.';
                let output_error = document.getElementById('error-output');
                output_error.innerText = obj.message;

                return doRecursiveRequest(url, limit-1,counter + 1);

            } else if(obj.status === "error"){
                return new Promise((resolve, reject) => reject(obj.error));
            }
                else {
                    return new Promise((resolve) => resolve(obj));
                }
        })
        .catch(error => {  let output_error = document.getElementById('error-output');
            output_error.innerText = error});

let addBook = document.querySelector("#submit-book");
let listBooks = document.querySelector("#listbooks-btn");
let update_btn = document.getElementById('update-book-btn');
let getKeyBtn = document.querySelector("#get-key-btn");
let delete_btn = document.getElementById('deletebook-btn');
//event listeners that can hear
update_btn.addEventListener('click', modify);
delete_btn.addEventListener('click', deleteBook);
addBook.addEventListener("click", addBookItem);
listBooks.addEventListener("click", listBookItems);
getKeyBtn.addEventListener("click", getKey);

function getKey() {
    let keyDisplay = document.querySelector("#key-area");
    let urlKeyReq = "https://www.forverkliga.se/JavaScript/api/crud.php?requestKey";
    let textarea_add = document.getElementById('key-text-id');
    let view_textarea = document.getElementById('view-catalog-id');
    let deleteUp_area = document.getElementById('mod-book-key');


    doRecursiveRequest(urlKeyReq).then(data => {keyDisplay.innerText = data.key;
        textarea_add.innerText = data.key;
        view_textarea.innerText = data.key;
        deleteUp_area.innerText = data.key; 

/**<textarea class="form-control" id="mod-book-key" rows="1" placeholder="You will n
 * eed you key to update or delete a book ...">
 *
 *
 * </textarea> **/
    }).catch(error => console.log(error));

}

function addBookItem(e) {
    let url = "https://www.forverkliga.se/JavaScript/api/crud.php?";
    let qs = "key=";
    e.preventDefault();
    let save_confirm = document.getElementById('confirm-book-saved');
    let key = document.getElementById("key-text-id").value;
    let titleInput = document.getElementById("title-id").value;
    let authorInput = document.getElementById("author-id").value;
    let crudInsert = '&op=insert';
    let title = "&title=" + titleInput;
    let author = "&author=" + authorInput;

    doRecursiveRequest(url + qs + key + crudInsert + title + author)
    .then(obj=> { save_confirm.innerHTML =`<label class="form-control" id="exampleTextarea" rows="12" style="margin-top: 0px; margin-bottom: 20px; height: 60px;"><span id='output-span'> ${titleInput} by ${authorInput} with id number: ${obj.id} was added to your catalog. Use your key to view ${titleInput} down below! <span></label>`;


    })
}
function listBookItems(e) {
    e.preventDefault();
    let titleOutput = document.getElementById("title-output-id");
    titleOutput.innerHTML = null;
    let url = "https://www.forverkliga.se/JavaScript/api/crud.php?";
    let qs = "key=";
    let keyListBookItems = document.getElementById("view-catalog-id").value;
    let crudSelect = '&op=select';
    let onDeletion = document.getElementById("output-on-deletion");

    doRecursiveRequest(url + qs + keyListBookItems + crudSelect)

        .then(obj => obj.data.forEach((el) => {
            titleOutput.innerHTML += "<label class=\"form-control\" id=\"exampleTextarea\" rows=\"12\" style=\"margin-top: 0px; margin-bottom: 20px; height: 115px;\"><span id='output-span'>" +
                "Title: " + el.title + "<br>" + " Author: " + el.author + "<br>" + "id: " + el.id
                + "<br>" + "Last updated: " + el.updated + "<span></label>";

        }));

    onDeletion.innerText=null;

}
function modify(e) {
    e.preventDefault();
    let url = "https://www.forverkliga.se/JavaScript/api/crud.php?";
    let book_id = document.getElementById('mod-book-id').value;
    let book_key = document.getElementById('mod-book-key').value;
    let title_mod = document.getElementById('book-title-mod').value;
    let author_mod = document.getElementById('mod-author-name').value;
    let output_confirm = document.getElementById('confirm-book-modified');

    let qs = "key=" +book_key;
    let crud_mod ="&op=update";
    let id ="&id="+ book_id;
    let title = "&title="+title_mod;
    let author = "&author=" + author_mod;
    doRecursiveRequest(url+qs+title+author+crud_mod+id).then(obj => obj);
    output_confirm.innerText = `Successfully updated a book with id number ${book_id}. The book title was updated to ${title_mod}. The authors name was changed to ${author_mod}`;
}

function deleteBook(e) {
    e.preventDefault();
    let url = "https://www.forverkliga.se/JavaScript/api/crud.php?";
    let output_confirm = document.getElementById('confirm-book-modified');
    let book_id = document.getElementById('mod-book-id').value;
    let book_key = document.getElementById('mod-book-key').value;
    let qs = "key=" +book_key;
    let crud_mod ="&op=delete";
    let id ="&id="+ book_id;
    let titleOutput = document.getElementById("title-output-id");
    let onDeletion = document.getElementById("output-on-deletion");
    doRecursiveRequest(url+qs+crud_mod+id).then(obj =>obj);
    output_confirm.innerText = `Successfully deleted book item with id number ${book_id}.`;
    titleOutput.innerText =null;
    onDeletion.innerText = `Book ${book_id} was removed. Click view to display the updated list of books`;


}