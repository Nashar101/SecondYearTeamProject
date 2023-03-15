function moveItem(checkbox) {
  // Get the list item that contains the checkbox
  var item = checkbox.parentNode.parentNode;

  // Determine which list the item currently belongs to
  var fromList, toList;
  if (item.parentNode.id === 'todo-list') {
    fromList = document.getElementById('todo-list');
    toList = document.getElementById('done-list');
  } else {
    fromList = document.getElementById('done-list');
    toList = document.getElementById('todo-list');
  }

  // Move the item to the other list
  fromList.removeChild(item);
  toList.appendChild(item);

  // Update the checkbox's onclick event to call this function with the new checkbox
  checkbox.setAttribute('onclick', 'moveItem(this)');
}
