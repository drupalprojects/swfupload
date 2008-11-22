sfwupload Module
================================================================================

DESCRIPTION:
--------------------------------------------------------------------------------
The SWFUpload module replaces the default upload and handles the upload through 
javascript/flash. It depends on the SWFUpload library which makes it possible to 
upload multiple file at once. 

For developers the swfupload module provide a hook function. Using this hook 
function developers can access several tasks of the upload process.


INSTALLATION:
--------------------------------------------------------------------------------
1. Enable the upload module.

2. Download and the swfupload module.
     (http://drupal.org/project/swfupload)

3. Download the SWFUpload 2.2 release.
     (http://code.google.com/p/swfupload/downloads/list)

4. Copy the files 'swfupload.swf' and 'swfupload.js' to the swfupload folder 
   inside the module folder. The end result will read:
     modules/swfupload/swfupload/swfupload.js
     modules/swfupload/swfupload/swfupload.swf

5. Download and install the required jquery_plugin module 
     (http://drupal.org/project/jquery_plugin).

6. Download the jQuery plugin TableDnD and place it inside the jquery_plugin 
   module folder.
     (http://www.isocra.com/2008/02/table-drag-and-drop-jquery-plugin/)

7. Download the jQuery plugin cssPNGFix and place it inside the jquery_plugin 
   module folder.
     (http://plugins.jquery.com/project/cssPNGFix)

8. Enable this module by navigating to:
     admin/build/modules

9. Configure the swfupload settings by navigating to:
     admin/settings/swfuploads


USAGE:
--------------------------------------------------------------------------------
The swfupload module depends on the core upload module, but replaces its upload 
fieldset in node forms. To give users permissions for uploading and accessing 
navigate to admin/user/permissions#module-upload. This module also provides a 
settings page on which administrators can configure upload settings per node-
type and per user-role. 

Developers can take the advantage of the hook function hook_swfupload(). Using 
this function developers have access to alter the way the files are displayed,
as well as how file uploads are processed. 


API:
--------------------------------------------------------------------------------

FORM ELEMENT SFWUPLOAD

  DESCRIPTION:

  Format a swfupload button. All required scripts and styles are included when 
  this form element is used.

  PROPERTIES:

  #type, #default_value, #max_files, #filepath, #file_extensions, 
  #max_img_resolution, #max_file_size, #max_queue_size, #node_settings

  EXAMPLE:

    $form['swfattachments']['upload'] = array(
      '#type' => 'swfupload_button',
      '#default_value' => drupal_to_js($form['#node']->files),
      '#max_files' => $settings['max_files'],
      '#filepath' => $settings['filepath'],
      '#file_extensions' => $settings['file_extensions'],
      '#max_img_resolution' => $settings['max_img_resolution'],
      '#max_file_size' => $settings['max_file_size'], // The maximum bytes per file
      '#max_queue_size' => $settings['node_max_file_size'], // The maximum bytes in the queue
      '#node_settings' => $settings, // Used to pass the settings for the current node to hook_swfupload. 
    );


HOOK_SWFUPLOAD():

  DEFINITION:

  hook_swfupload(&$file, $op, &$instance)
  

  DESCRIPTION:

  Provide other modules a hook to change the data for the swfupload scripts.
  Modules can change the default provided fields, customize the way files are
  uploaded and change the type of swfupload (table or button).

  PARAMETERS:

  $file: The file object in its different states. 

  $op: What kind of action is being performed. Possible values:
    
    'init': The swfupload is being initialized. Here you can change the instance
            object in order to define other javascript callback functions, or to
            change the way the files are displayed.

    'move_uploaded_file': The swfupload requests an upload. Here you can alter 
            the file object in order to change it's filename or the destination
            folder. You can also change the validation functions which are passed 
            to file_save_upload(). The file object will look something similar 
            like this: 

            $file = (object) array(
              'validators' => array(
                'file_validate_extensions => 'jpg jpeg gif png txt',
                'file_validate_image_resolution' => '800x600',
                'file_validate_size' => array('1048576, 33554432),
              ),
              'filepath' => 'files/'
            );

    'upload_complete': The upload is complete. Using the hook_function in this 
            state, the file can be copied, modified or you can do some database 
            stuff. The file object will look something similar like this:

            $file = (object) array(
                'filename' => 'Image1.png',
                'filepath' => 'files/Image1_3.png',
                'filemime' => 'image/png',
                'source' => 'upload',
                'destination' => 'files/Image1_3.png',
                'filesize' => 220567,
                'uid' => '3',
                'status' => 0,
                'timestamp' => 1227182505,
                'fid' => '2468' }
              ),
              'filepath' => 'files/'
            );

  $instance: The instance object in its different states. When $op is 'init' the 
      instance can be altered in order to change the callback functions or to change
      the way the upload module displayes files. When $op is 'move_uploaded_file' or 
      'upload_complete', the instance object can be used as a reference.
      The reference object on init:

      // The type of the instance. Currently only table is supported
      $instance->type = 'table';

      // Javascript callback functions
      $instance->callbacks = array(
        'swfupload_loaded_handler' => 'ref.swfUploadLoaded',
        'file_queued_handler' => 'ref.fileQueued',
        'queue_complete_handler' => 'ref.queueComplete',
        'file_queue_error_handler' => 'ref.fileQueueError',
        'file_dialog_complete_handler' => 'ref.dialogComplete',
        'upload_success_handler' => 'ref.uploadSuccess',
        'upload_progress_handler' => 'ref.uploadProgress',
        'upload_error_handler' => 'ref.uploadError',
        'upload_complete_handler' => 'ref.uploadComplete',
        'init_complete_handler' => 'ref.initComplete',
      );

      // The elements array represents all elements which are displayed on added files.
      // Each element can be changed. Javascript will render the proper markup.
      $instance->elements = array(
        'drag' => array(
          'class' => 'drag first',
          'type' => 'drag',
          'colspan' => 3,
          'title' => t('Description'),
          'add_separator' => TRUE,
        ),
        'icon' => array(
          'type' => 'icon',
          'class' => 'icon',
        ),
        'description' => array(
          'type' => 'text',
          'default_value' => '{filename}',
          'class' => 'text title',
        ),
        'list' => array(
          'title' => t('List'),
          'type' => 'checkbox',
          'default_value' => $node_settings->list,
          'class' => 'checkbox',
          'contains_progressbar' => TRUE,
          'add_separator' => TRUE,
        ),
        'alt' => array(
          'title' => t('Alternate Text'),
          'type' => 'textarea',
          'default_value' => '{filename}',
          'class' => 'text',
          'contains_progressbar' => TRUE,
        ),
        'cancel' => array(
          'class' => 'last',
          'type' => 'cancel',
        ),
      );


  EXAMPLE:

  /**
   * Implementation of hook_swfupload().
   */
  function MODULENAME_swfupload(&$file, $op, &$instance) {
    switch ($op) {
      case 'init':
        // Add a custom callback function to be executed after the scripts have 
        // been initialized.
        $instance->callbacks['init_complete_handler'] = 'myCustomCallbackFunction';

        // Add a custom editabe tabledrawer. 
        $instance->elements['test'] => array(
          'class' => 'drag first', // The class for the td
          'type' => 'text', // An editable textfield will be added. Values will be saved!
          'colspan' => 2, // Colspan for this td
          'title' => t('Description'), // This will be used in the th
          'add_separator' => TRUE, // Whether or not to put a separator between the colums in the thead.
        );
        break;
      case 'move_uploaded_file':
        global $user;
        $file->filepath = "files/$user->uid/"; // Files will be stored in an user folder
        break;
      case 'upload_complete':
        db_query("INSERT INTO {mymoduletable} (fid, filename) VALUES ('%s', '%s')", $file->fid, $file->filename);
        break;
    }
  }


BUGS:
--------------------------------------------------------------------------------

1. If the swfupload is loaded inside a collapsed fieldset, Firefox occasionally 
   crashes when the fieldset expanded. 

2. If the 2.1 version of the SWFUpload library is used, Flash player 10 will not
   allow javascript to let flash open the file select window.

3. There will be more......


TODO:
--------------------------------------------------------------------------------

1. Add a new instance type called 'button'. Currently there's only an instance 
   type 'table' which displays the files in a list. With type set to 'button' 
   users can upload only images which replace the upload button.  

2. A lot of debugging.

