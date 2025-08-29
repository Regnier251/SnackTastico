(function ($) {
  "use strict";

  // Manejar el scroll y la navegación
  $(document).ready(function() {
    // Manejar el scroll
    $(window).scroll(function() {
      if ($(this).scrollTop() > 50) {
        $(".navbar").addClass("navbar-scrolled");
      } else {
        $(".navbar").removeClass("navbar-scrolled");
      }
    });

    // No añadimos nuevo manejador para scroll-to-section aquí
    // ya que usaremos el existente en la parte inferior del archivo

    // Actualizar enlace activo al hacer scroll
    $(window).scroll(function() {
      let scrollPos = $(document).scrollTop();
      $('.scroll-to-section').each(function() {
        let target = $(this).attr('href');
        if (target && target.startsWith('#')) {
          let section = $(target);
          if (section.length) {
            if (section.position().top <= scrollPos + 100 && 
                section.position().top + section.height() > scrollPos) {
              $('.nav-link').removeClass('active');
              $(this).addClass('active');
            }
          }
        }
      });
    });
  });
  

  // Modern Slider
  $(".Modern-Slider").slick({
    autoplay: true,
    autoplaySpeed: 10000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    dots: true,
    pauseOnDotsHover: true,
    cssEase: 'linear',
	fade:true,
    draggable: false,
    prevArrow: '<button class="PrevArrow"></button>',
    nextArrow: '<button class="NextArrow"></button>', 
  });

  // Search functionality
  $('.search-icon a').on("click", function(e) {
    e.preventDefault();
    $("#search").addClass("open");
    $('#search > form > input[type="search"]').focus();
  });

  $("#search, #search button.close").on("click keyup", function(e) {
    if (e.target == this || e.target.className == "close" || e.keyCode == 27) {
      $(this).removeClass("open");
    }
  });

  $("#search-box").submit(function(e) {
    e.preventDefault();
  });

  // Menu items carousel
  $('.owl-menu-item').owlCarousel({
    items: 5,
    loop: true,
    dots: true,
    nav: true,
    autoplay: true,
    autoplayTimeout: 7000,
    autoplaySpeed: 1000,      // Duración de la transición
    smartSpeed: 1000,         // Velocidad de animación suave
    margin: 30,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 5 }
    }
  });

  // Mobile menu
  function mobileNav() {
    var width = $(window).width();
    $('.submenu').on('click', function() {
      if(width < 767) $(this).find('ul').toggleClass('active');
    });
  }

  mobileNav();
  window.sr = new scrollReveal();

  // Menu dropdown toggle
  // $(".menu-trigger").on('click', function() {
  //   $(this).toggleClass('active');
  //   $('.header-area .nav').slideToggle(200);
  // });

  // Smooth scrolling
  $('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function(e) {
    if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
      e.preventDefault();
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        var width = $(window).width();
        if(width < 991) {
          $('.menu-trigger').removeClass('active');
          $('.header-area .nav').slideUp(140);	
        }
        
        // Calcular el offset basado en la altura actual del navbar
        var navbarHeight = $('.navbar').outerHeight();
        var extraOffset = 20; // Espacio extra para mejor visibilidad
        
        $('html,body').animate({
          scrollTop: target.offset().top - navbarHeight - extraOffset
        }, 160);
      }
    }
  });

  $(document).on("scroll", onScroll);

  function onScroll() {
    var scrollPos = $(document).scrollTop();
    var navbarHeight = $('.navbar').outerHeight();
    
    $('.nav a').each(function () {
      var currLink = $(this);
      var target = currLink.data('scroll-target') || currLink.attr('href');
      var refElement = $(target);
      
      if (refElement.length && 
          refElement.position().top - navbarHeight <= scrollPos && 
          refElement.position().top + refElement.height() > scrollPos + navbarHeight) {
        $('.nav ul li a').removeClass("active");
        currLink.addClass("active");
      } else {
        currLink.removeClass("active");
      }
    });
  }

  // Page loading animation
  $(window).on('load', function() {
    if($('.cover').length) {
      $('.cover').parallax({
        imageSrc: $('.cover').data('image'),
        zIndex: '1'
      });
    }

    $("#preloader").animate({ 'opacity': '0' }, 600, function(){
      setTimeout(function() {
        $("#preloader").css("visibility", "hidden").fadeOut();
      }, 300);
    });
  });

  $(window).on('resize', mobileNav);

  // Menu item selection
  $('.owl-menu-item .item').on('click', function() {
    $('.owl-menu-item .item').removeClass('selected');
    $(this).addClass('selected');
  });

  // Animated pet
  $(function() {
    const $pet = $('#animatedPet');
    const images = [
      "assets/images/about/mascota/Charcutería_Negro-01.webp",
      "assets/images/about/mascota/Charcutería_Negro-02.webp"
    ];
    
    $.each(images, function(i, img) { new Image().src = img; });

    let index = 0;
    setInterval(() => {
      index = (index + 1) % images.length;
      $pet.fadeOut(0, function() {
        $(this).attr('src', images[index]).fadeIn(0);
      });
    }, 2000);
  });

  // Tab animations
  const tabs = document.querySelectorAll('#tabs ul li a');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      const targetTab = document.querySelector(this.getAttribute('href'));
      const currentActive = document.querySelector('.tab-pane.active');
      
      if (currentActive && !currentActive.isSameNode(targetTab)) {
        currentActive.classList.remove('active');
        currentActive.classList.add('exit');
        
        setTimeout(() => {
          currentActive.classList.remove('exit');
          showTab(targetTab);
        }, 300);
      } else if (!currentActive) {
        showTab(targetTab);
      }
    });
  });

  function showTab(tabElement) {
    document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active'));
    tabElement.classList.add('active');
  }

  // Initialize first tab
  const firstTab = document.querySelector('#tabs-1');
  if (firstTab) showTab(firstTab);

  // Button ripple effect
  document.querySelector('.btn-reservation').addEventListener('mouseenter', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    this.appendChild(ripple);

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    ripple.addEventListener('animationend', function() {
      ripple.remove();
    });
    ripple.classList.add('ripple');

    ripple.addEventListener('animationend', () => ripple.remove());
  });

  document.addEventListener('DOMContentLoaded', function() {
  const tabsContainer = document.querySelector('#tabs');
  const tabs = tabsContainer.querySelectorAll('ul li a');
  const tabPanes = tabsContainer.querySelectorAll('.tab-pane');
  
  // Usamos una variable para controlar la animación en curso
  let isAnimating = false;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (isAnimating) return;
      
      const targetId = this.getAttribute('href');
      const targetTab = document.querySelector(targetId);
      const currentActive = tabsContainer.querySelector('.tab-pane.active');
      
      if (!targetTab || (currentActive && currentActive.isSameNode(targetTab))) {
        return;
      }
      
      isAnimating = true;
      
      const handleAnimationEnd = () => {
        currentActive.removeEventListener('transitionend', handleAnimationEnd);
        currentActive.classList.remove('exit', 'active');
        targetTab.classList.add('active');
        isAnimating = false;
      };
      
      if (currentActive) {
        currentActive.addEventListener('transitionend', handleAnimationEnd);
        currentActive.classList.add('exit');
      } else {
        targetTab.classList.add('active');
        isAnimating = false;
      }
    });
  });
  
  // Activar primera pestaña
  const firstTab = tabsContainer.querySelector('.tab-pane');
  if (firstTab) firstTab.classList.add('active');

  // Manejo de tarjetas del menú
  const cards = document.querySelectorAll('.card');
    
  cards.forEach(card => {
      card.addEventListener('click', function(e) {
          e.stopPropagation(); // Evitar que el click se propague al documento
          // Si la tarjeta ya está activa, la desactivamos
          if (this.classList.contains('active')) {
              this.classList.remove('active');
          } else {
              // Primero removemos active de todas las tarjetas
              cards.forEach(c => c.classList.remove('active'));
              // Luego activamos solo la tarjeta clickeada
              this.classList.add('active');
          }
      });
  });

  // Cerrar tarjeta activa cuando se hace click fuera
  $(document).on('click', function(event) {
      if (!$(event.target).closest('.card').length) {
          $('.card.active').removeClass('active');
      }
  });
});

})(window.jQuery);