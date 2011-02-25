
/**
 * @file
 * 
 * Firefox crashes when the shockwave file of SWFUpload is loaded inside a collapsed fieldset.
 * It's not yet clear what causes this, but by commenting the duration inside Drupal.toggleFiedset,
 * it is temporarily solved.
 * 
 * This file only containes a replacement for Drupal.toggleFieldset and is only loaded if the
 * swfupload is loaded inside a collapsed fieldset and if the users browser is mozilla.
 */


Drupal.toggleFieldset = function(fieldset) {
  if ($(fieldset).is('.collapsed')) {
    // Action div containers are processed separately because of a IE bug
    // that alters the default submit button behavior.
    var content = $('> div:not(.action)', fieldset);
    $(fieldset).removeClass('collapsed');
    content.hide();
    content.slideDown( {
// Here the duration is commented so Firefox won't crash on expanding fieldsets.
//      duration: 'fast', 
      easing: 'linear',
      complete: function() {
        Drupal.collapseScrollIntoView(this.parentNode);
        this.parentNode.animating = false;
        $('div.action', fieldset).show();
      },
      step: function() {
        // Scroll the fieldset into view
        Drupal.collapseScrollIntoView(this.parentNode);
      }
    });
  }
  else {
    $('div.action', fieldset).hide();
    var content = $('> div:not(.action)', fieldset).slideUp('fast', function() {
      $(this.parentNode).addClass('collapsed');
      this.parentNode.animating = false;
    });
  }
};
