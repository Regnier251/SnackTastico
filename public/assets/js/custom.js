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

    // Cerrar menú al hacer clic en cualquier enlace
    $('.nav-link, .navbar-brand, .btn-reservation').on('click', function() {
      $('.navbar-collapse').collapse('hide');
    });

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
              // $(this).addClass('active');
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
    prevArrow: '<button class="PrevArrow" aria-label="Banner anterior"></button>',
    nextArrow: '<button class="NextArrow" aria-label="Banner siguiente"></button>', 
  });

  // Menu items carousel
  const $menuCarousel = $('.owl-menu-item');
  const MENU_AUTOPLAY_DELAY = 5000;
  let menuAutoplayTimer = null;

  function scheduleMenuAutoplayResume() {
    if (menuAutoplayTimer) {
      clearTimeout(menuAutoplayTimer);
    }
    menuAutoplayTimer = setTimeout(function() {
      const carousel = $menuCarousel.data('owl.carousel');
      if (!carousel) return;
      const timeout = carousel.settings && carousel.settings.autoplayTimeout ? carousel.settings.autoplayTimeout : 6000;
      $menuCarousel.trigger('play.owl.autoplay', [timeout]);
    }, MENU_AUTOPLAY_DELAY);
  }

  $menuCarousel.owlCarousel({
    items: 5,
    loop: true,
    dots: true,
    nav: true,
    autoplay: true,
    autoplayTimeout: 6000,
    autoplaySpeed: 1000,
    smartSpeed: 1000,
    autoplayHoverPause: true,
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
          $('.header-area .nav').slideUp(220);	
        }
        
        // Calcular el offset basado en la altura actual del navbar
        var navbarHeight = $('.navbar').outerHeight();
        var extraOffset = 20;
        
        $('html,body').animate({
          scrollTop: target.offset().top - navbarHeight - extraOffset
        }, 220);
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
  function hidePreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    preloader.style.opacity = '0';
    setTimeout(function() {
      preloader.style.display = 'none';
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
    }, 600);
  }

  function initCover() {
    if ($('.cover').length) {
      $('.cover').parallax({
        imageSrc: $('.cover').data('image'),
        zIndex: '1'
      });
    }
  }

  // Initialize when document is ready
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', function() {
      initCover();
      hidePreloader();
    });
  } else {
    initCover();
    hidePreloader();
  }

  $(window).on('resize', mobileNav);

  // Menu item selection
  $menuCarousel.on('click', '.item', function() {
    const carousel = $menuCarousel.data('owl.carousel');
    if (carousel && carousel.is('animating')) {
      return;
    }
    $('.owl-menu-item .item').removeClass('selected');
    $(this).addClass('selected');
    $menuCarousel.trigger('stop.owl.autoplay');
    scheduleMenuAutoplayResume();
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

  //Menu area
  const MENU_TAB_ICONS = {
    'tabs-1': '/assets/images/menu/submenu/tab-icon-01.webp',
    'tabs-2': '/assets/images/menu/submenu/tab-icon-02.webp',
    'tabs-3': '/assets/images/menu/submenu/tab-icon-03.webp',
    'tabs-4': '/assets/images/menu/submenu/tab-icon-04.webp',
    'tabs-5': '/assets/images/menu/submenu/tab-icon-05.webp',
    'tabs-6': '/assets/images/menu/submenu/tab-icon-06.webp',
    'tabs-7': '/assets/images/menu/submenu/tab-icon-07.webp',
    'tabs-10': '/assets/images/menu/submenu/tab-icon-10.webp'
  };
  const DEFAULT_TAB_ICON = MENU_TAB_ICONS['tabs-1'];
  const DEFAULT_ITEM_IMAGE = '/assets/images/coming_soon.jpg';

  function createTabLink(category) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${category.id}`;

    const icon = document.createElement('img');
    icon.src = MENU_TAB_ICONS[category.id] || DEFAULT_TAB_ICON;
    icon.alt = '';

    link.appendChild(icon);
    link.appendChild(document.createTextNode(category.name || ''));
    li.appendChild(link);
    return { li, link };
  }

  function createPriceBlock(prices) {
    if (!Array.isArray(prices) || !prices.length) {
      return null;
    }
    const priceDiv = document.createElement('div');
    priceDiv.className = 'price';
    prices.forEach((priceText) => {
      const price = document.createElement('h6');
      price.textContent = priceText;
      priceDiv.appendChild(price);
    });
    return priceDiv;
  }

  function createMenuItem(item, alignment) {
    const col = document.createElement('div');
    col.className = 'col-lg-12';

    const tabItem = document.createElement('div');
    tabItem.className = 'tab-item';
    tabItem.setAttribute('data-aos', alignment === 'right' ? 'fade-left' : 'fade-right');

    const img = document.createElement('img');
    const imageSrc =
      (item.image && item.image.src) ? item.image.src : DEFAULT_ITEM_IMAGE;
    img.src = imageSrc;
    img.alt = (item.image && item.image.alt) || item.name || '';

    const title = document.createElement('h4');
    title.textContent = item.name || '';

    const description = document.createElement('p');
    description.textContent = item.description || '';

    tabItem.appendChild(img);
    tabItem.appendChild(title);
    tabItem.appendChild(description);

    const priceBlock = createPriceBlock(item.prices);
    if (priceBlock) {
      tabItem.appendChild(priceBlock);
    }

    col.appendChild(tabItem);
    return col;
  }

  function createMenuColumn(items, alignment) {
    if (!items.length) {
      return null;
    }
    const column = document.createElement('div');
    column.className = 'col-lg-6';

    const row = document.createElement('div');
    row.className = 'row';

    const list = document.createElement('div');
    list.className = alignment === 'right' ? 'right-list' : 'left-list';

    items.forEach((item) => {
      list.appendChild(createMenuItem(item, alignment));
    });

    row.appendChild(list);
    column.appendChild(row);
    return column;
  }

  function createCategoryPane(category) {
    const article = document.createElement('article');
    article.id = category.id;
    article.className = 'tab-pane';

    const row = document.createElement('div');
    row.className = 'row';

    const items = Array.isArray(category.items) ? category.items : [];
    if (!items.length) {
      const emptyCol = document.createElement('div');
      emptyCol.className = 'col-12 text-center py-5';
      const message = document.createElement('p');
      message.textContent = 'Próximamente';
      emptyCol.appendChild(message);
      row.appendChild(emptyCol);
      article.appendChild(row);
      return article;
    }

    const mid = Math.ceil(items.length / 2);
    const leftColumn = createMenuColumn(items.slice(0, mid), 'left');
    const rightColumn = createMenuColumn(items.slice(mid), 'right');

    if (leftColumn) row.appendChild(leftColumn);
    if (rightColumn) row.appendChild(rightColumn);

    article.appendChild(row);
    return article;
  }

  function renderMenu(menu) {
    const tabsList = document.getElementById('menu-tabs');
    const contentContainer = document.getElementById('menu-tabs-content');

    if (!tabsList || !contentContainer) {
      return;
    }

    tabsList.innerHTML = '';
    contentContainer.innerHTML = '';

    if (!Array.isArray(menu) || !menu.length) {
      tabsList.innerHTML = '<li class="menu-placeholder">Menú no disponible.</li>';
      contentContainer.innerHTML = `
        <article class="tab-pane active">
          <div class="row">
            <div class="col-12 text-center py-5">
              <p>Por el momento no hay elementos para mostrar.</p>
            </div>
          </div>
        </article>`;
      return;
    }

    const tabsFragment = document.createDocumentFragment();
    const panesFragment = document.createDocumentFragment();

    menu.forEach((category, index) => {
      if (!category || !category.id) {
        return;
      }

      const { li, link } = createTabLink(category);
      tabsFragment.appendChild(li);

      const pane = createCategoryPane(category);
      panesFragment.appendChild(pane);

      if (index === 0) {
        pane.classList.add('active');
        link.classList.add('active');
      }
    });

    tabsList.appendChild(tabsFragment);
    contentContainer.appendChild(panesFragment);
  }

  function initializeTabs() {
    const tabsContainer = document.querySelector('#tabs');
    if (!tabsContainer) {
      return;
    }

    const tabLinks = tabsContainer.querySelectorAll('ul li a');
    const tabPanes = tabsContainer.querySelectorAll('.tab-pane');
    let isAnimating = false;

    tabLinks.forEach((link) => {
      link.addEventListener('click', function handleTabClick(event) {
        event.preventDefault();
        if (isAnimating) return;

        const targetId = this.getAttribute('href');
        const targetTab = targetId ? tabsContainer.querySelector(targetId) : null;
        const currentActive = tabsContainer.querySelector('.tab-pane.active');

        if (!targetTab || currentActive === targetTab) {
          return;
        }

        isAnimating = true;

        const finishTransition = () => {
          currentActive.removeEventListener('transitionend', finishTransition);
          currentActive.classList.remove('exit', 'active');
          targetTab.classList.add('active');
          isAnimating = false;
        };

        if (currentActive) {
          currentActive.addEventListener('transitionend', finishTransition, { once: true });
          currentActive.classList.add('exit');
        } else {
          targetTab.classList.add('active');
          isAnimating = false;
        }

        tabLinks.forEach((tabLink) => tabLink.classList.remove('active'));
        this.classList.add('active');
      });
    });

    if (tabPanes.length) {
      tabPanes[0].classList.add('active');
      if (tabLinks[0]) {
        tabLinks[0].classList.add('active');
      }
    }
  }

  function initializeCardsInteraction() {
    const cards = document.querySelectorAll('.card');
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener('click', function (event) {
        event.stopPropagation();
        if (this.classList.contains('active')) {
          this.classList.remove('active');
        } else {
          cards.forEach((c) => c.classList.remove('active'));
          this.classList.add('active');
        }
      });
    });

    $(document).on('click', function (event) {
      if (!$(event.target).closest('.card').length) {
        $('.card.active').removeClass('active');
      }
    });
  }

  async function loadMenu() {
    const tabsList = document.getElementById('menu-tabs');
    if (!tabsList) {
      return;
    }

    try {
      const response = await fetch('/data/menu.json', { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      renderMenu(Array.isArray(data.menu) ? data.menu : []);
      initializeTabs();
      if (window.AOS && typeof window.AOS.refresh === 'function') {
        window.AOS.refresh();
      }
    } catch (error) {
      console.error('Error al cargar el menú:', error);
      tabsList.innerHTML = '<li class="menu-placeholder">No se pudo cargar el menú.</li>';
      const contentContainer = document.getElementById('menu-tabs-content');
      if (contentContainer) {
        contentContainer.innerHTML = `
          <article class="tab-pane active">
            <div class="row">
              <div class="col-12 text-center py-5">
                <p>Ocurrió un error al cargar el menú. Intenta nuevamente más tarde.</p>
              </div>
            </div>
          </article>`;
      }
    }
  }

  // Button ripple effect
  const reservationButton = document.querySelector('.btn-reservation');
  if (reservationButton) {
    reservationButton.addEventListener('mouseenter', function(e) {
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
  }

  document.addEventListener('DOMContentLoaded', function() {
    loadMenu();
    initializeCardsInteraction();
  });

})(window.jQuery);
