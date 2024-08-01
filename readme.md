<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<br />
<div align="center">
  <h3 align="center">React CSV File Importer</h3>

  <p align="center">
    Import and update CSV files to your Plone site
    <br />
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#login">Login</a></li>
        <li>
            <a href="#submission">Submission</a>
            <ul>
                <li>
                    <a href="#inputs">Inputs</a>
                    <ul>
                        <li><a href="#uploading-a-file">Uploading a file</a></li>
                        <li><a href="#selecting-the-content-type">Selecting the content type</a></li>
                        <li><a href="#selecting-the-primary-key">Selecting the primary key</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#toggle-options">Toggle options</a>
                    <ul>
                        <li><a href="#auto-create-new-items">Auto-create new items</a></li>
                        <li><a href="#allow-import-into-empty-folder">Allow import into empty folder</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#submission-process">Submission process</a>
                    <ul>
                        <li><a href="#uploading-a-new-file">Uploading a new file</a></li>
                        <li><a href="#updating-existing-data">Updating existing data</a></li>
                    </ul>
                </li>
            </ul>
        </li>
        <li><a href="#selecting-items">Selecting Items</a></li>
        <li>
            <a href="#after-import">After import</a>
            <ul>
                <li>
                    <a href="#import-messages">Import messages</a>
                    <ul>
                        <li><a href="#import-completed">Import completed</a></li>
                        <li><a href="#import-skipped">Import skipped</a></li>
                        <li><a href="#import-failed">Import failed</a></li>
                    </ul>
                </li>
                <li><a href="#log-and-results">Log and results</a></li>
                <li>
                    <a href="#result-examples">Result examples</a>
                    <ul>
                        <li><a href="#all-items-imported-successfully">All items imported successfully</a></li>
                        <li><a href="#imported-and-skipped">Imported and skipped</a></li>
                        <li><a href="#imported-and-failed">Imported and failed</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#log-examples">Log examples</a>
                    <ul>
                        <li><a href="#log-with-new-and-updated-data">Log with new and updated data</a></li>
                        <li><a href="#log-with-fields-not-imported">Log with fields not imported</a></li>
                    </ul>
                </li>
            </ul>
        </li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

![submission screenshot][usage-submission]
<br />
This React web app allows users to post and update CSV data to their Plone site.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [React.js][React-url]
- [Sass][Sass-url]
- [file-saver][file-saver-url]
- [Papaparse][Papaparse-url]
- [React icons][React-icons-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This project is designed to work with Plone 6.0. Before installing, ensure that you have a functioning Plone site and the appropriate authorization to post and modify data on the Plone site.


### Installation

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd <project-directory>`
3. Install the dependencies: `npm install`
4. Start the server using `npm run dev`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Follow the step-by-step guide below to successfully use this app.

### Login

![login screenshot][usage-login]
<br />
To use this app, you must first log in. Begin by entering the Plone site URL you wish to upload to, then add your credentials. The app will check if you have permission to modify the site. A banner will appear, notifying you if you have permission or not.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Submission

![submission screenshot][usage-submission]
<br />
If you are authorized to modify data on the selected URL, the app will render the submission form. The app leaves the URL and credentials fields visible, so you can change the URL or credentials if needed. An authorization check will be performed before the submission again.


#### Inputs
##### Uploading a file

Select the file you want to import from your local machine to upload. After selecting your file, Papaparse parses it. The first column becomes the fields, and the remaining columns become the data values for those fields.

_Note: The uploader only accepts .CSV files._

##### Selecting the content type

Type in the content type you want the data to be. The app will first check if the content type is valid and existing on your Plone site. Invalid content types will throw an error.

Selecting the right content type is vital, as the app will match the parsed fields in your uploaded file to the fields in the selected content type. The app uses a type dictionary to find the matching fields using either the `id` or `title` data for each field from the `url/@types/contentType`. Your CSV fields need to be named to match either one.

If you have fields in your CSV file that cannot be matched to fields in the content type, these fields will not be imported. However, you'll be informed of these failures in the log later.

- If you are uploading the file for the first time, the content type you select will be the deciding content type from then on.
- If you are updating data, you must select the same content type for a successful import. Each folder URL only accepts one content type.


##### Selecting the primary key

Type in the primary key. The app works by checking each file item's primary key and if it's the same primary key for the items on the selected site. If a primary key exists, the app will attempt to update the data from your CSV file item to the matching primary key item on the site. Invalid primary keys will throw an error.

The primary key corresponds to each item's `@id` and is also the URL path. For example, if your primary key is `id` and the id value for an item is `1234`, then the URL is `https://plonesite.com/folder/1234`. Thus, it's important to select a CSV field with concise and unique values for each item as the primary key.

- If you are uploading the file for the first time, the primary key you select will be the deciding primary key from then on.
- If you are updating data, you must select the same primary key for a successful import. Each folder URL only accepts one primary key.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Toggle Options

Whenever you submit a new file, you'll have two toggle options. By default, these options are off. To turn them on, click the toggle. A green toggle means the option is selected and on.

##### Auto-create New Items

This option allows new items to be posted on your site.

- If you are updating an existing file and also have new items to add, turn this option on. If this option is turned off and there are new items, they will fail to import.
- If you are only updating existing files, leave this option off.
- If you are uploading the file for the first time, turn this on. 

_Note: When uploading a new file to an empty folder, both options need to be turned on._

##### Allow Import into Empty Folder

This option allows posting new items to an empty folder. This option automatically turns on the "Auto-create new items" option.

- If you are uploading a file for the first time, turn this on.
- If you are updating or posting new items in a folder that already has existing items, leave this off.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Submission Process

In the background, the file is parsed, and then one of two options follows:

##### Uploading a New File

1. Checking if the user is authorized
2. Checking if the content type is valid for the Plone site
3. Checking if the primary key input exists as a field in the selected CSV file
4. Checking if both options are turned on

##### Updating Existing Data

1. Checking if the user is authorized
2. Checking if the content type is valid:
   - Is an existing content type on the Plone site
   - Is the decided content type in the folder URL
3. Checking if the primary key is valid:
   - Is a field in the selected CSV file
   - Is the primary key for items in the folder URL
4. Checking if the "Auto-create new items" option is turned on
   - If off, new items in the CSV file will be skipped
   - If on, new items in the CSV file will be posted

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Selecting items

![selection screenshot][usage-selection]
<br />
After a successful submission process, you get a view to select which items from your CSV file you want to upload. Each item is displayed by its primary key value.

- Check all/uncheck all option
- Pagination for easier viewing, showing 10 items per page

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### After import

#### Import Messages

After selecting the items and clicking the "Start Import" button, you may encounter different results. Each result is displayed with a message banner.

##### Import Completed

A successful import to some degree. All or some items were imported. You'll see more detailed information in the provided log.

##### Import Skipped

The app detected no new data in your CSV file. The CSV file data is the same as the data currently on the Plone site. The import form is cleared after displaying the message.

##### Import Failed

The "Auto-create new items" option was turned off, and you only had new items in your CSV file. The import form is cleared after displaying the message.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Log and results

If your import was successful to some degree, you'll see more detailed information on which items were successfully imported, and a log showing the updated data along with new items. You'll also see three buttons:

- `View Log` shows a toggled view of the log
- `Download Log` downloads the log as a .txt file
- `New Import` clears the import form and prepares for a new import

#### Result Examples

##### All Items Imported Successfully

![import example success screenshot][usage-import-example1]
<br />
This example shows a successful import, with one item updated and the other a new item uploaded.

##### Imported and Skipped

![import example success and skipped screenshot][usage-import-example2]
<br />
In this example, one item was updated, while the other was skipped. The skipped item had no new data, so there was nothing to update.

##### Imported and Failed

![import example success and failure screenshot][usage-import-example3]
<br />
In this example, the `auto-create new items` option was turned off. The import managed to find one of the selected items by its primary key and successfully updated it. It could not find the other item because the primary key did not exist on the URL.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Log Examples

##### Log with New and Updated Data

![log example with updated and new item screenshot][usage-log1]
<br />
In this example, you can see which fields were updated for an item. It displays the old and updated value, so you can be sure of what has changed in greater detail. It also displays a list of new items that were added.

##### Log with Fields Not Imported

![log example with fields not imported screenshot][usage-log2]
<br />
In this example, a list of fields that failed to import is displayed. Because these fields did not exist on the content type, they were skipped for that item's import.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

<!-- USAGE SCREENSHOTS -->

[usage-login]: /plone-import/src/assets/login.png
[usage-submission]: /plone-import/src/assets/submission.png
[usage-selection]: /plone-import/src/assets/selection.png
[usage-log1]: /plone-import/src/assets/log1.png
[usage-log2]: /plone-import/src/assets/log2.png
[usage-import-example1]: /plone-import/src/assets/import-example1.png
[usage-import-example2]: /plone-import/src/assets/import-example2.png
[usage-import-example3]: /plone-import/src/assets/import-example3.png

<!-- LINKS -->

[React-url]: https://reactjs.org/
[Sass-url]: https://sass-lang.com/
[file-saver-url]: https://www.npmjs.com/package/file-saver
[Papaparse-url]: https://www.papaparse.com/
[React-icons-url]: https://react-icons.github.io/react-icons/
