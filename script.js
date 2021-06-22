const modal = document.querySelector('.modal');
const btnAddTask = document.querySelector('.btn-add-task');
const btnCancelTask = document.querySelector('.btn-cancel-task');
const iptToggleModal = document.querySelector('#ipt-toggle-modal');
const tasksList = document.querySelector(".tasks");
// const filterOption = document.querySelector(".filter-tasks");

let isEditing = false;
let editingTaskIndex = '';
let LIST, id;
document.addEventListener("DOMContentLoaded", (el) => {
	sortanimated();
	let deleted = localStorage.getItem("deleted");
	let data = localStorage.getItem("AllTasks");
	let notitask = document.getElementById("-1");
	let location = localStorage.getItem("location");
	
	// check if data is not empty
	if(data){
		LIST = JSON.parse(data);
		id = LIST.length + 1; // set the id to the last one in the list
		if (location !== null) {
			locate = location.split(',');
			locate.forEach(element => {
				// console.log(LIST[element])
				loadList(LIST[element]); // load the list to the user interface
	
			});
		}else{
			
		}
	}else{
		// if data isn't empty
		LIST = [];
		id = 1;
	}
	if (deleted == "true") {
		notitask.parentElement.removeChild(notitask);

		if ( $('.tasks').children().length > 0 ) {
			$(".non-task-noti").fadeOut("slow");
		} else {
			$(".non-task-noti").fadeIn("slow");
		};
	} else {
		notitask.parentElement.appendChild(notitask);
		$(".non-task-noti").fadeOut("slow");
		
	};

});

function loadList(item){
	loadtask(item.title, item.description, item.priority, item.id, item.done, item.trash, item.time);
}
function loadtask(title, description, priority, id, done, trash, time){

	if (trash){return;};
			
		const complete = done ? '-is-completed' : "";
		const status = done ? 'Task completed' : "";
		let style;
		
		switch (priority) {
			case 'high':
				style = '#F45366';
				break;
			case 'medium':
				style = '#627DFE';
				break;
			case 'low':
				style = '#aaa';
				break;
			default:
				console.log('default color applied to icon');
				break;}
		let taskloaded
		if (description !== "") {
			taskloaded = 	`<div class="task ${complete}" id="${id}">
								<div class="task-header admin">
									<div class="left-side admin">
										<i class="fad fa-fire-alt" data-priority="${priority}" style="color: ${style};"></i><span class="task-title">${title}</span>
									</div>
									<div class="right-side">
										<div class="btn-edit-task" title="Edit task" onclick="editTask(event, this)"><i class="fad fa-pencil"></i></div>
										<div class="btn-complete-task" title="Complete task" onclick="completeTask(event, this)"><i class="fad fa-check"></i></div>
										<div class="btn-remove-task" title="Remove task" onclick="removeTask(event, this)"><i class="fad fa-trash" ></i></div>
									</div>
								</div>
								<div class="task-body"><span class="task-description">${description}</span></div>
								<div class="task-footer"><span class="task-status">${status}</span><span class="task-timestamp">${time}</span></div>
							</div>`
		} else {
			taskloaded = 	`<div class="task ${complete}" id="${id}">
								<div class="task-header admin">
									<div class="left-side admin">
										<i class="fad fa-fire-alt" data-priority="${priority}" style="color: ${style};"></i><span class="task-title">${title}</span>
									</div>
									<div class="right-side">
										<div class="btn-edit-task" title="Edit task" onclick="editTask(event, this)"><i class="fad fa-pencil"></i></div>
										<div class="btn-complete-task" title="Complete task" onclick="completeTask(event, this)"><i class="fad fa-check"></i></div>
										<div class="btn-remove-task" title="Remove task" onclick="removeTask(event, this)"><i class="fad fa-trash" ></i></div>
									</div>
								</div>
								<div class="task-footer"><span class="task-status">${status}</span><span class="task-timestamp">${time}</span></div>
							</div>`
		}
		const position = "beforeend";
	
		tasksList.insertAdjacentHTML(position, taskloaded);
				
};



btnCancelTask.addEventListener('click', () => {
	document.querySelector(".btn-toggle-modal .fas").style.opacity = "1";
	iptToggleModal.checked = false;
	document.querySelector('#task-title').blur();
	modal.reset();
	document.querySelectorAll('.task').forEach(task => {
		task.classList.remove('swipe-right');
	});
});

document.addEventListener('keydown', evt => {
	if (evt.key === 'Escape' && iptToggleModal.checked) {
		iptToggleModal.checked = false;
		document.querySelector('#task-title').blur();
		modal.reset();
		document.querySelectorAll('.task').forEach(task => {
			task.classList.remove('swipe-right');
		});
	}

	if (evt.key === '+' && !iptToggleModal.checked) {
		document.querySelector('.overlay > p').innerText = 'Add task';
		document.querySelector('.btn-add-task').innerText = 'Add';

		iptToggleModal.checked = true;
		document.querySelectorAll('.task').forEach(task => {
			task.classList.add('swipe-right');
		});

		setTimeout(() => {
			document.querySelector('#task-title').focus();
		},300);
	}
});

iptToggleModal.addEventListener('change', function () {
	if(document.querySelector(".tasks").length == 0){i = 0;}
	if (this.checked) {
		document.querySelector(".btn-toggle-modal .fas").style.opacity = "0";
		document.querySelector(".btn-toggle-modal").style.transform = "translateY(-100%);";
		document.querySelector('.overlay > p').innerText = 'Add task';
		document.querySelector('.btn-add-task').innerText = 'Add';

		document.querySelectorAll('.task').forEach((task, index) => {
			task.classList.add('swipe-right');
			task.style.transitionDelay = index * .02 + 's';
		});
		document.querySelector('#task-title').focus();
	}else{
		document.querySelector(".btn-toggle-modal .fas").style.opacity = "1";
		modal.reset();
		document.querySelectorAll('.task').forEach(task => {
			task.classList.remove('swipe-right');
		});
	}
});

btnAddTask.addEventListener('click', function (evt) {
	document.querySelector(".btn-toggle-modal .fas").style.opacity = "1";
	if (isEditing) {
		evt.preventDefault();

		let newTitle = document.querySelector('#task-title').value.trim();
		let newDesc = document.querySelector('#task-desc').value.trim();
		let newTimestamp = moment().format('HH:mm:ss - DD/MM/YYYY');
		let newPriority;

		let taskToEdit = document.getElementById(editingTaskIndex);

		document.querySelectorAll('input[name="priority"]').forEach(item => {
			if (item.checked)
			newPriority = item.value;
		});

		if (newTitle.length > 0 && newTitle !== '' && newTitle.replace(/\s/g, '') !== '') {
			taskToEdit.querySelector('.task-title').innerText = newTitle;

			if (taskToEdit.querySelector('.task-description') !== null && taskToEdit.querySelector('.task-description') !== undefined) {
				if (newDesc.length > 0 && newDesc !== '' && newDesc.replace(/\s/g, '') !== '') {
					taskToEdit.querySelector('.task-description').innerText = newDesc;
				} else
				{
					taskToEdit.querySelector('.task-body').parentElement.removeChild(taskToEdit.querySelector('.task-body'));
				}
			}else{
				if (newDesc.length > 0 && newDesc !== '' && newDesc.replace(/\s/g, '') !== '') {
					const taskBody = document.createElement('div');
					taskBody.classList.add('task-body');
					const taskDesc = document.createElement('span');
					taskDesc.classList.add('task-description');
					taskDesc.innerText = newDesc;
					taskBody.appendChild(taskDesc);

					taskToEdit.querySelector('.task-footer').before(taskBody);
				}
			}

			switch (newPriority) {
				case 'high':
					taskToEdit.querySelector('i').style.color = '#F45366';
					taskToEdit.querySelector('i').dataset.priority = 'high';
					break;
				case 'medium':
					taskToEdit.querySelector('i').style.color = '#627DFE';
					taskToEdit.querySelector('i').dataset.priority = 'medium';
					break;
				case 'low':
					taskToEdit.querySelector('i').style.color = '#aaa';
					taskToEdit.querySelector('i').dataset.priority = 'low';
					break;
				default:
					console.log('default color applied to icon');
					break;}

			const btnEditTask = document.createElement('div');
			btnEditTask.classList.add('btn-edit-task');
			btnEditTask.title = 'Edit task';
			btnEditTask.addEventListener('click', editTask);
			const editIcon = document.createElement('i');
			editIcon.classList = 'fad fa-pencil';
			btnEditTask.appendChild(editIcon);

			const btnCompleteTask = document.createElement('div');
			btnCompleteTask.classList.add('btn-complete-task');
			btnCompleteTask.title = 'Complete task';
			btnCompleteTask.addEventListener('click', completeTask);
			const completeIcon = document.createElement('i');
			completeIcon.classList = 'fad fa-check';
			btnCompleteTask.appendChild(completeIcon);

			const btnRemoveTask = document.createElement('div');
			btnRemoveTask.classList.add('btn-remove-task');
			btnRemoveTask.title = 'Remove task';
			btnRemoveTask.addEventListener('click', removeTask);
			const removeIcon = document.createElement('i');
			removeIcon.classList = 'fad fa-trash';
			btnRemoveTask.appendChild(removeIcon);

			taskToEdit.querySelector('.task-timestamp').innerText = newTimestamp;

			iptToggleModal.checked = false;
			modal.reset();

			document.querySelectorAll('.task').forEach(item => {
				item.classList.remove('swipe-right');
			});

			document.querySelector('.notification').classList.add('-is-shown');

			setTimeout(() => {
				document.querySelector('.notification').classList.remove('-is-shown');
			}, 1000);

			isEditing = false;
			count = 0;
			LIST[taskToEdit.id - 1].title = newTitle;
			LIST[taskToEdit.id - 1].description = newDesc;
			LIST[taskToEdit.id - 1].priority = newPriority;
			LIST[taskToEdit.id - 1].time = newTimestamp;

			localStorage.setItem("AllTasks", JSON.stringify(LIST));
			document.querySelector('#task-title').blur();

		}else{
			document.querySelector('#task-title').focus();
			document.querySelector('.overlay > span').classList.add('-w-animation');
			document.querySelector('.overlay > span').innerText = 'Fill at least the title of the task, description is not required 😵';
			document.querySelector('.overlay > span').addEventListener('animationend', () => {
				document.querySelector('.overlay > span').classList.remove('-w-animation');
				document.querySelector('.overlay > span').innerText = 'Fill at least the title of the task, description is not required 😀';
			});
		}
	}else{
		evt.preventDefault();
		document.querySelector('#task-title').focus();
		let title = document.querySelector('#task-title').value.trim();
		let desc = document.querySelector('#task-desc').value.trim();
		let timestamp = moment().format('HH:mm:ss - DD/MM/YYYY');
		// let timestamp = moment().calendar(); 
		let priority;

		document.querySelectorAll('input[name="priority"]').forEach(item => {
			if (item.checked)
			priority = item.value;
		});

		if (title.length > 0 && title !== '' && title.replace(/\s/g, '') !== '') {
			const task = document.createElement('li');
			task.classList.add('task', 'swipe-right');
			task.id = id;

			const taskHeader = document.createElement('div');
			taskHeader.classList.add('task-header');

			const leftSide = document.createElement('div');
			leftSide.classList.add('left-side');

			const icon = document.createElement('i');
			icon.classList = 'fad fa-fire-alt';
			switch (priority) {
				case 'high':
					icon.style.color = '#F45366';
					icon.dataset.priority = 'high';
					break;
				case 'medium':
					icon.style.color = '#627DFE';
					icon.dataset.priority = 'medium';
					break;
				case 'low':
					icon.style.color = '#aaa';
					icon.dataset.priority = 'low';
					break;
				default:
					console.log('default color applied to icon');
					break;}


			const taskTitle = document.createElement('span');
			taskTitle.classList.add('task-title');
			taskTitle.innerText = title;

			leftSide.appendChild(icon);
			leftSide.appendChild(taskTitle);

			const rightSide = document.createElement('div');
			rightSide.classList.add('right-side');

			const btnEditTask = document.createElement('div');
			btnEditTask.classList.add('btn-edit-task');
			btnEditTask.title = 'Edit task';
			btnEditTask.addEventListener('click', editTask);
			const editIcon = document.createElement('i');
			editIcon.classList = 'fad fa-pencil';
			btnEditTask.appendChild(editIcon);

			const btnCompleteTask = document.createElement('div');
			btnCompleteTask.classList.add('btn-complete-task');
			btnCompleteTask.title = 'Complete task';
			btnCompleteTask.addEventListener('click', completeTask);
			const completeIcon = document.createElement('i');
			completeIcon.classList = 'fad fa-check';
			btnCompleteTask.appendChild(completeIcon);

			const btnRemoveTask = document.createElement('div');
			btnRemoveTask.classList.add('btn-remove-task');
			btnRemoveTask.title = 'Remove task';
			btnRemoveTask.addEventListener('click', removeTask);
			const removeIcon = document.createElement('i');
			removeIcon.classList = 'fad fa-trash';
			btnRemoveTask.appendChild(removeIcon);

			rightSide.appendChild(btnEditTask);
			rightSide.appendChild(btnCompleteTask);
			rightSide.appendChild(btnRemoveTask);

			taskHeader.appendChild(leftSide);
			taskHeader.appendChild(rightSide);

			const taskBody = document.createElement('div');
			taskBody.classList.add('task-body');

			if (desc.length > 0 && desc !== '' && desc.replace(/\s/g, '') !== '') {
				const taskDesc = document.createElement('span');
				taskDesc.classList.add('task-description');
				taskDesc.innerText = desc;

				taskBody.appendChild(taskDesc);

				task.appendChild(taskHeader);
				task.appendChild(taskBody);
			} else {
				task.appendChild(taskHeader);
			}

			const taskFooter = document.createElement('div');
			taskFooter.classList.add('task-footer');

			const taskStatus = document.createElement('span');
			taskStatus.classList.add('task-status');
			taskStatus.innerText = 'Task completed';

			const taskTimestamp = document.createElement('div');
			taskTimestamp.classList.add('task-timestamp');
			taskTimestamp.innerText = timestamp;
		
			
			taskFooter.appendChild(taskStatus);
			taskFooter.appendChild(taskTimestamp);
			task.appendChild(taskFooter);

			LIST.push({
				title: title,
				description: desc,
				priority: priority,
				id: task.id,
				done: false,
				trash: false,
				time: timestamp,
			});
			localStorage.setItem("AllTasks", JSON.stringify(LIST));
			// console.log(JSON.stringify(LIST));
			let firstTask;
			document.querySelector('#task-title').blur();
			if (document.querySelector('.tasks').children.length >= 1){
				firstTask = document.querySelector('.task');
				if (firstTask !== undefined) {
					firstTask.before(task);
				}else{
					document.querySelector('.tasks').appendChild(task);
					$(".non-task-noti").hide();
				};
			}else{
				document.querySelector('.tasks').appendChild(task);
				$(".non-task-noti").hide();
			}
			

			iptToggleModal.checked = false;
			modal.reset();

			document.querySelectorAll('.task').forEach((item, index) => {
				if (item !== task) {
					item.classList.remove('swipe-right');
				} else {
					item.style.transitionDelay = index * .02 + 's';
					setTimeout(() => {
						item.classList.remove('swipe-right');
					}, index * .1);
				}
			});

			isEditing = false;
			count = 0;
			id++;
			sortanimated();
			sort();
			savelocation();
		} else{
			document.querySelector('.overlay > span').classList.add('-w-animation');
			document.querySelector('.overlay > span').innerText = 'Fill at least the title of the task, description is not required 😵';
			document.querySelector('.overlay > span').addEventListener('animationend', () => {
				document.querySelector('.overlay > span').classList.remove('-w-animation');
				document.querySelector('.overlay > span').innerText = 'Fill at least the title of the task, description is not required 😃';
			});
		}
	}
});

function editTask(evt, el) {
	const btn = el == undefined ? this : el;
	const task = btn.parentNode.parentNode.parentNode;
	let title = task.querySelector('.task-title').innerText;
	let desc = '';
	editingTaskIndex = task.id;

	if (task.querySelector('.task-description') !== null && task.querySelector('.task-description') !== undefined) {
		desc = task.querySelector('.task-description').innerText;
	}

	let priority = task.querySelector('i').dataset.priority;

	document.querySelector('.overlay > p').innerText = 'Edit task';
	document.querySelector('.btn-add-task').innerText = 'Save';

	document.querySelector('#task-title').value = title;
	document.querySelector('#task-title').focus();
	document.querySelector('#task-desc').value = desc;

	document.querySelectorAll('input[name="priority"]').forEach(item => {
		if (item.value == priority) {
			item.checked = true;
		}
	});

	iptToggleModal.checked = true;
	document.querySelectorAll('.task').forEach(item => {
		item.classList.add('swipe-right');
	});

	isEditing = true;
}

function completeTask(evt, el) {
	const btn = el == undefined ? this : el;
	const task = btn.parentNode.parentNode.parentNode;
	task.classList.toggle('-is-completed');
	task.querySelector(".task-status").innerText = 'Task completed';
	// filterTasks();
	LIST[task.id - 1].done = LIST[task.id - 1].done ? false : true;
	localStorage.setItem("AllTasks", JSON.stringify(LIST));
	console.log(LIST);
}

function removeTask(evt, el) {
	const btn = el == undefined ? this : el;
	const task = btn.parentNode.parentNode.parentNode;
	if (task.id == "-1"){
		localStorage.setItem("deleted", "true");
	} else {
		// console.log(task.id);
		// console.log(LIST);
		LIST[task.id - 1].trash = true;

		localStorage.setItem("AllTasks", JSON.stringify(LIST));
	}
	let taskStatus = task.querySelector('.task-status');
	taskStatus.innerText = 'Task removed';
	task.classList.add('-is-removed');

	setTimeout(() => {
		task.classList.add('swipe-right');
	}, 500);

	setTimeout(() => {
		if (document.querySelector('.tasks').children.length == 1) {
			$(".non-task-noti").fadeIn();
		};
		task.parentElement.removeChild(task);
	}, 1000);
};

document.querySelector(".remove-all-tasks").addEventListener("click", removeAllTask);

function removeAllTask() {
	if (document.querySelector('.tasks').children.length > 0) {
		var wrapper = $(".confirm-wrapper"),
			overlay = $(".confirm-wrapper .overlay"),
			confirm = $(".confirm-wrapper .confirm");
			wrapper.addClass("show");
			overlay.addClass("show");
			confirm.addClass("show");

		$(".confirm-wrapper .btn-wrap button.yes").click(function() {
			const task = document.querySelectorAll(".task");
			var i;
			for (i = 0; i < task.length; i++) {
				task[i].classList.add('-is-removed');
				setTimeout(() => {
					for (i = 0; i < task.length; i++) {
						task[i].classList.add('swipe-right');
					};
				}, 500 + i*30);
			};
			localStorage.removeItem("AllTasks");
			localStorage.removeItem("location");
			localStorage.setItem("deleted", "true");
			wrapper.removeClass("show");
			overlay.removeClass("show");
			confirm.removeClass("show");
			setTimeout(() => {
				const task = document.querySelectorAll(".task");
				if (document.querySelector('.tasks').children.length >= 1) {
					$(".non-task-noti").fadeIn("slow");
					for (i = 0; i < task.length; i++) {
						task[i].parentNode.removeChild(task[i]);
						location.reload();
					};
				};
			}, 1000 + i*15);
		});
							
		$(".confirm-wrapper .btn-wrap button.no").click(function() {
				wrapper.removeClass("show");
				overlay.removeClass("show");
				confirm.removeClass("show");
			});
	}else{
		document.querySelector('.non-task-noti').classList.add('-w-animation2');
		document.querySelector('.non-task-noti').innerHTML = 'There are no tasks here<br>Click plus (+) button to create one<br><br>（︶^︶）';
		document.querySelector('.non-task-noti').addEventListener('animationend', () => {
			document.querySelector('.non-task-noti').innerHTML = 'There are no tasks here<br>Click plus (+) button to create one<br><br>(￣ω￣)';
			document.querySelector('.non-task-noti').classList.remove('-w-animation2');
		}); 
	};
};
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', e => {
	cursor.setAttribute("style", "top: "+(e.pageY - 10)+"px; left: "+(e.pageX - 10)+"px;")
})

document.addEventListener('click', () => {
	sort();
	cursor.classList.add("expand");

	setTimeout(() => {
		cursor.classList.remove("expand");
	}, 300)
});

$(document).ready(() => {
	sort();
	sortanimated();
});
function sort(){
	$(".tasks").sortable({
		update: function (event, ui) {
			savelocation();
		}
	});
};
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
function sortanimated(){
	var task = document.querySelectorAll(".task");
	if (width > 500) {
		task.forEach(function(e){
			e.addEventListener("mousedown", () => {
				e.style.transition = "none";
			});
			e.addEventListener("mouseleave", () => {
				e.style.transition = "all 0.35s ease";
				
			})
		});
	}
	if (width <= 500) {
		task.forEach(function(e){
			e.addEventListener("touchmove", () => {
				// console.log('click');
				e.style.transition = "none";
			});
			e.addEventListener("touchend", () => {
				e.style.transition = "all 0.35s ease";
	
			})
		});
	}
}
function savelocation() {
        var locationArray = [];
        $(".task").each(function (count, item) {
            locationArray[count] = item.id-1;
        });
        var locate = locationArray.toString();
        localStorage.setItem("location", locate);
}