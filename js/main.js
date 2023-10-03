
/**
 *
 *  Main JavaScript
 *
 *  @package ohkimur_scripts
 *
 **/

// IIFE - Immediately Invoked Function Expression
(function ($, window, document) {

  // The $ is now locally scoped

  // Listen for the jQuery ready event on the document
  $(function () {

    // The DOM is ready!

    // Global Variables
    var $window = $(window);

    /**
     *  Page Loader
     **/
    setTimeout(function () {
      $('.page-loader').addClass('load-complete');
    }, 1500);

    /**
     *  Parallax with Scrollax.js - Initialization
     **/
    'use strict';
    $.Scrollax();

    /**
     *  Main Menu Navigation
     **/
    var $body = $('body');
    var $nav_menu = $('.navigation-bar');
    var $nav_menu_link = $('#navMenu ul li a');
    var $toggle_menu_button = $('.navTrigger');

    // Navigation Menu Link
    $nav_menu_link.on('click', function () {

      // Select Current Navigation Item
      $nav_menu_link.parent().removeClass('current-menu-item');
      $(this).parent().addClass('current-menu-item');

      // Close Mobile Menu
      $nav_menu.removeClass('active');
      $toggle_menu_button.removeClass('active');
      $body.removeClass('no-scroll');

    });

    // Toggle Mobile Menu
    $toggle_menu_button.on('click', function () {
      $nav_menu.toggleClass('active');
      $body.toggleClass('no-scroll');
      $(this).toggleClass('active');
    });

    // Remove all classes on window resize
    $window.on('resize', function () {
      $nav_menu.removeClass('active');
      $body.removeClass('no-scroll');
      $toggle_menu_button.removeClass('active');
    });

    /**
     *  Portfolio
     **/
    var $filter_menu_item = $('.filter-menu ul li');
    var $portfolio_grid = $('.portfolio-grid');
    var $portfolio_grid_item = $portfolio_grid.children(".item");
    var $overlay = $portfolio_grid.children("#overlay");
    var $img = '<img alt="Portfolio Overlay Image" />';
    var $data_filters = null;

    // Filter Menu
    $filter_menu_item.on('click', function () {

      // Filter Menu
      $filter_menu_item.removeClass('current');
      $(this).addClass('current');

      // Collecting Data Filters
      $data_filters = $(this).data('filter');

      // Hide All Portfolio Items
      if ($data_filters == 'all') {
        $portfolio_grid_item.addClass('visible');
      }
      else { // Show Portfolio Items from filter
        $portfolio_grid_item.removeClass('visible');
        $($data_filters).addClass('visible');
      }

    });

    // Show Image - Lightbox
    $portfolio_grid_item.find(".item-expand").on('click', function (e) {

      // Prevent Default Link Event
      e.preventDefault();

      // Get Image Link
      var $src = $(this).attr("href");

      // Create Image on the DOM
      $overlay.append($img);

      // Show Overlay Image
      $overlay.fadeIn(200).children("img").attr("src", $src);

      // Lock Body Scroll
      $body.toggleClass('no-scroll');

    });

    // Hide Overlay Lightbox
    $overlay.on('click', function () {

      // Hide Overlay Image
      $(this).fadeOut(200);

      // Remove Image from DOM
      $overlay.children("img").remove();

      // Unlock Body Scroll
      $body.toggleClass('no-scroll');

    });

    /**
     *  Scroll Event
     **/
    $window.scroll(function () {

      // Scroll Variables
      var $scrollTop = $window.scrollTop();
      var $windowHeight = $window.height();

      /**
       *  Go to Top Button
       **/
      var $go_top = $('.go-to-top-button');

      if ($scrollTop > 600) {
        $go_top.addClass('active');
      } else {
        $go_top.removeClass('active');
      }

      // Reveal Item on Scroll
      function revealItem($container, $item) {
        if ($scrollTop > ($container.offset().top - $windowHeight / 1.3)) {

          $item.each(function (i) {
            setTimeout(function () {
              $item.eq(i).addClass("is-showing");
            }, 150 * (i + 1));
          });

        }
      }

      // Portfolio Reveal Images
      revealItem($portfolio_grid, $portfolio_grid_item);

    });

    /**
     *  Testimonials Carousel Setup
     **/
    $("#testimonials-carousel").owlCarousel({

      navigation: true, // Show next & prev buttons
      slideSpeed: 300,
      paginationSpeed: 400,
      singleItem: true

    });

    /**
     *  Smooth Scrolling for Links
     **/
    $('a[href*="#"]:not([href="#"])').on('click', function () {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });

  });

}(window.jQuery, window, document));
// The global jQuery object is passed as a parameter
