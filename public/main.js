$(function() {
	console.log("JS WORKING!");
	//handlebars set up for posts
	var baseUrl = '/api/posts';
	var $postslist = $('#posts-list');
	var source = $('#posts-template').html();
	var template = Handlebars.compile(source);

	var allPosts = [];
	var allComments = [];

	var $postform = $('.post-form');

	var render = function() {
		// empty existing todos from view
		$postslist.empty();
		// pass `allTodos` into the template function
		var postsHtml = template({
			posts: allPosts //allTodos in mongo
		});
		// append html to the view
		$postslist.append(postsHtml);
	};


	$.get(baseUrl, function(data) {
		console.log("hello");
		//set allTodos to todo data from API
		allPosts = data.posts;
		render();
	});
	//   POSTING
	$('.post-form').on('submit', function(event) {
		event.preventDefault();
		//serialize form data

		var newPost = $(this).serialize();
		//POST request to create new book
		$.post(baseUrl, newPost, function(data) {
			console.log(data);
			allPosts.push(data);
			render();
		});

		//resetting form
		$postform[0].reset();
		$postform.find('input').first().focus();

	});

	//EDIT 
	//add event-handlers to posts for updating/deleting



	$("body").on("click", ".update-post", function(event) {

		event.preventDefault();
		console.log("yoyoyoyo");
		// var postId = $(this).attr('data-id');
		var postId = $(this).attr("data-id");

		var postUpdate = allPosts.filter(function(post) {
			return post._id == postId;
		})[0];
		var updatePost = $(this).serialize();

		$.ajax({
			type: "PUT",
			url: '/api/posts/' + postId,
			data: updatePost,
			success: function(data) { //data that comes back from server {
				allPosts.splice(allPosts.indexOf(postUpdate), 1, data);
				render();
			}
		});



	});



	$("body").on("click", ".delete-post", function(event) {
		event.preventDefault();
		console.log("HEY THERE");

		// find the todo's id (stored in HTML as `data-id`)
		var postId = $(this).attr("data-id");

		// find the todo to delete by its id
		var postToDelete = allPosts.filter(function(todo) {
			return post._id == postId;
		})[0];

		// DELETE request to delete todo
		$.ajax({
			type: "DELETE",
			url: '/api/posts/' + postId,
			success: function(data) {
				// remove deleted todo from all todos
				allPosts.splice(allPosts.indexOf(postToDelete), 1);

				// render all todos to view
				render();
			}
		});
	});


	
//name of input should be attribute of comments if using serialize	!
	//POSTING COMMENTS
	$('body').on('submit', '.comment-form', function(event) { 
		console.log("FORM SUBMITTING");
		event.preventDefault();
		//serialize form data
		var postId = $(this).attr("data-id");//local

		var newComment = $(this).serialize();
		//POST request to create new book
		$.post('/api/posts/' + postId + '/comments', newComment, function(data) {//:id is for server
			console.log(data);
			var foundPost = allPosts.filter(function(post) {
				return post._id == postId;
			})[0];
			foundPost.comments.push(data);
			render();
		});

		//resetting form
		$postform[0].reset();
		$postform.find('input').first().focus();

	});



});