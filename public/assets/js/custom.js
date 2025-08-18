(function ($) {
	
	"use strict";

	$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  var box = $('.header-text').height();
	  var header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	});
	
	$('.filters ul li').click(function(){
	  $('.filters ul li').removeClass('active');
	  $(this).addClass('active');
	  
	  var data = $(this).attr('data-filter');
	  $grid.isotope({
	    filter: data
	  })
	});

	var $grid = $(".grid").isotope({
	  itemSelector: ".all",
	  percentPosition: true,
	  masonry: {
	    columnWidth: ".all"
	  }
	})

	$(".Modern-Slider").slick({
	    autoplay:true,
	    autoplaySpeed:10000,
	    speed:600,
	    slidesToShow:1,
	    slidesToScroll:1,
	    pauseOnHover:false,
	    dots:true,
	    pauseOnDotsHover:true,
	    cssEase:'linear',
	   // fade:true,
	    draggable:false,
	    prevArrow:'<button class="PrevArrow"></button>',
	    nextArrow:'<button class="NextArrow"></button>', 
	  });

	$('.search-icon a').on("click", function(event) {
	    event.preventDefault();
	    $("#search").addClass("open");
	    $('#search > form > input[type="search"]').focus();
	  });

	  $("#search, #search button.close").on("click keyup", function(event) {
	    if (
	      event.target == this ||
	      event.target.className == "close" ||
	      event.keyCode == 27
	    ) {
	      $(this).removeClass("open");
	    }
	  });

	  $("#search-box").submit(function(event) {
	    event.preventDefault();
	    return false;
	  });


	$(function() {
        $("#tabs").tabs();
    });

	$('.owl-menu-item').owlCarousel({
		items:5,
		loop:true,
		dots: true,
		nav: true,
		autoplay: true,
		margin:30,
		  responsive:{
			  0:{
				  items:1
			  },
			  600:{
				  items:2
			  },
			  1000:{
				  items:5
			  }
		  }
	  })

	// Window Resize Mobile Menu Fix
	mobileNav();

	// Scroll animation init
	window.sr = new scrollReveal();
	
	// Menu Dropdown Toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}

	// Menu elevator animation
	$('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				var width = $(window).width();
				if(width < 991) {
					$('.menu-trigger').removeClass('active');
					$('.header-area .nav').slideUp(200);	
				}				
				$('html,body').animate({
					scrollTop: (target.offset().top) - 80
				}, 700);
				return false;
			}
		}
	});

	$(document).ready(function () {
	    $(document).on("scroll", onScroll);
	    
	    //smoothscroll
	    $('.scroll-to-section a[href^="#"]').on('click', function (e) {
			e.preventDefault();
			$(document).off("scroll");
			
			$('.scroll-to-section a').each(function () {
				$(this).removeClass('active');
			})
			$(this).addClass('active');
		  
			var target = this.hash,
			menu = target;
			var target = $(this.hash);
			$('html, body').stop().animate({
				scrollTop: (target.offset().top) - 79
			}, 500, 'swing', function () {
				window.location.hash = target;
				$(document).on("scroll", onScroll);
			});
	        
	    });
	});

	// function onScroll(event){
	//     var scrollPos = $(document).scrollTop();
	//     $('.nav a').each(function () {
	//         var currLink = $(this);
	//         var refElement = $(currLink.attr("href"));
	//         if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
	//             $('.nav ul li a').removeClass("active");
	//             currLink.addClass("active");
	//         }
	//         else{
	//             currLink.removeClass("active");
	//         }
	//     });
	// }

	function onScroll(event) {
		var scrollPos = $(document).scrollTop();
		$('.nav a').each(function () {
			var currLink = $(this);
			var target = currLink.data('scroll-target');
			
			if (!target) return;
			
			var refElement = $(target);
			if (refElement.length && refElement.position().top <= scrollPos && 
				refElement.position().top + refElement.height() > scrollPos) {
				$('.nav ul li a').removeClass("active");
				currLink.addClass("active");
			} else {
				currLink.removeClass("active");
			}
		});
	}

	// Page loading animation
	$(window).on('load', function() {
		if($('.cover').length){
			$('.cover').parallax({
				imageSrc: $('.cover').data('image'),
				zIndex: '1'
			});
		}

		$("#preloader").animate({
			'opacity': '0'
		}, 600, function(){
			setTimeout(function(){
				$("#preloader").css("visibility", "hidden").fadeOut();
			}, 300);
		});
	});

	// Window Resize Mobile Menu Fix
	$(window).on('resize', function() {
		mobileNav();
	});

	// Window Resize Mobile Menu Fix
	function mobileNav() {
		var width = $(window).width();
		$('.submenu').on('click', function() {
			if(width < 767) {
				$('.submenu ul').removeClass('active');
				$(this).find('ul').toggleClass('active');
			}
		});
	}

	$(document).ready(function(){
		// Cuando se hace clic en una tarjeta
		$('.owl-menu-item .item').on('click', function() {
			// Elimina la clase 'selected' de todas las tarjetas
			$('.owl-menu-item .item').removeClass('selected');
			
			// Añade la clase 'selected' a la tarjeta que fue clickeada
			$(this).addClass('selected');
		});
	});

	$(function() {
		const $pet = $('#animatedPet');
		const images = [
			"assets/images/about/mascota/Charcutería_Negro-01.png",
			"assets/images/about/mascota/Charcutería_Negro-02.png"
		];
		
		// Precarga imágenes
		$.each(images, function(i, img) {
			new Image().src = img; 
		});

		let index = 0;
		setInterval(() => {
			index = (index + 1) % images.length;
			$pet.fadeOut(0, function() {
			$(this).attr('src', images[index]).fadeIn(0);
			});
		}, 2000); // Cambia cada 3 segundos con efecto fade
	});

})(window.jQuery);

document.querySelector('.main-white-button').addEventListener('mouseenter', function(e) {
    // Crear el elemento del ripple
    const ripple = document.createElement('span');
    this.appendChild(ripple);

    // Calcular el tamaño y la posición del ripple
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    // Establecer las propiedades del ripple
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // Añadir la clase para la animación
    ripple.classList.add('ripple');

    // Eliminar el ripple después de que termine la animación
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
});