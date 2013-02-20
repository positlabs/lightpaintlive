package com.positlabs.lightpaintlive;

import java.io.File;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.Button;
import android.widget.Gallery;
import android.widget.ImageView;
import android.widget.Toast;

public class GalleryActivity extends Activity {

	protected static final String TAG = "GalleryActivity";
	private ImageView fullsize;
	private Button deleteBtn;
	private Button shareBtn;
	private AlertDialog prompt;
	private Gallery gallery;

	/** list of all pics in the LPL gallery directory */
	public static File[] imageFiles;

	/**
	 * pointer to the selected image file. Just makes it easier to grab for
	 * deletion and sharing
	 */
	private File currentImage;

	private int currentPosition;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.gallery);

		prompt = new AlertDialog.Builder(GalleryActivity.this).create();
		prompt.setTitle("Delete picture");
		prompt.setMessage("Are you sure?");
		prompt.setButton(AlertDialog.BUTTON_POSITIVE, "delete", promptClick);
		prompt.setButton(AlertDialog.BUTTON_NEGATIVE, "cancel", promptClick);

		deleteBtn = (Button) findViewById(R.id.deleteBtn);
		deleteBtn.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				// prompt "are you sure you want to delete this picture?"
				prompt.show();
			}
		});

		shareBtn = (Button) findViewById(R.id.shareBtn);
		shareBtn.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				Uri imgUri = Uri.parse("file://" + currentImage.getAbsolutePath());
				Log.d(TAG, "currentImage.getAbsolutePath(): " + currentImage.getAbsolutePath());
				Log.d(TAG, "currentImage.getPath(): " + currentImage.getPath());

				Intent intent = new Intent(Intent.ACTION_SEND);
				intent.setType("image/jpeg");
				intent.putExtra(Intent.EXTRA_STREAM, imgUri);
				intent.putExtra(Intent.EXTRA_SUBJECT, "Painting with Light Paint Live: Android");
				intent.putExtra(Intent.EXTRA_TITLE, "Painting with Light Paint Live: Android");
				intent.putExtra(Intent.EXTRA_TEXT, "http://lightpaintlive.com");
				startActivity(Intent.createChooser(intent, "share with:"));
			}
		});

		// get file list
		File imgFolder = new File(Environment.getExternalStorageDirectory() + "/DCIM/LightPaintLive");
		imgFolder.mkdirs();
		imageFiles = imgFolder.listFiles();

		if (imageFiles.length > 0) {
			// set fullsize view source to the most recent img
			fullsize = (ImageView) findViewById(R.id.galleryFullview);
			currentPosition = imageFiles.length - 1;
			currentImage = imageFiles[currentPosition];
			fullsize.setImageBitmap(BitmapFactory.decodeFile(currentImage.getPath()));

			// init gallery thumbs
			gallery = (Gallery) findViewById(R.id.gallery);
			gallery.setAdapter(new ImageAdapter(this));
			gallery.setOnItemClickListener(galleryClick);
		}else{
			Toast.makeText(this, "The gallery is empty! Save a painting and come back!", Toast.LENGTH_LONG).show();
		}
	}

	/** click listener for gallery thumbs. */
	private OnItemClickListener galleryClick = new OnItemClickListener() {
		public void onItemClick(AdapterView parent, View v, int position, long id) {
			Log.d(TAG, "OnItemClickListener galleryClick ");
			Log.d(TAG, "position: " + position);

			// view full size pic
			currentPosition = Math.abs(position - imageFiles.length + 1);
			currentImage = imageFiles[currentPosition];
			Bitmap bm = BitmapFactory.decodeFile(currentImage.getPath(), null);
			fullsize.setImageBitmap(bm);
		}
	};

	private DialogInterface.OnClickListener promptClick = new DialogInterface.OnClickListener() {
		@Override
		public void onClick(DialogInterface dialog, int which) {
			switch (which) {
			case DialogInterface.BUTTON_POSITIVE:
				// delete the currently selected image from the sdcard
				currentImage.delete();

				// update the file list
				File imgFolder = new File(Environment.getExternalStorageDirectory() + "/DCIM/LightPaintLive");
				imageFiles = imgFolder.listFiles();

				// re-init the gallery
				gallery.setAdapter(new ImageAdapter(GalleryActivity.this));

				// set current image with position of deleted image
				currentPosition = Math.min(currentPosition, imageFiles.length - 1);
				currentImage = imageFiles[currentPosition];
				Bitmap bm = BitmapFactory.decodeFile(currentImage.getPath(), null);
				fullsize.setImageBitmap(bm);

				// set the thumb to the complement index
				gallery.setSelection(Math.abs(currentPosition - imageFiles.length + 1), true);

				break;
			case DialogInterface.BUTTON_NEGATIVE:
				dialog.cancel();
				break;
			}
		}
	};

}