package com.positlabs.lightpaintlive;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.BitmapFactory;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewGroup.LayoutParams;
import android.widget.BaseAdapter;
import android.widget.ImageView;

public class ImageAdapter extends BaseAdapter {
	private static final String TAG = "ImageAdapter";
	int mGalleryItemBackground;
	private Context mContext;

	public ImageAdapter(Context c) {
		mContext = c;
		TypedArray attr = mContext.obtainStyledAttributes(R.styleable.HelloGallery);
		mGalleryItemBackground = attr.getResourceId(R.styleable.HelloGallery_android_galleryItemBackground, 0);
		attr.recycle();

		// Log.d(TAG, "file count: " + imageFiles.length);
	}

	public int getCount() {
		return GalleryActivity.imageFiles.length;
	}

	public Object getItem(int position) {
		return position;
	}

	public long getItemId(int position) {
		return position;
	}

	public View getView(int position, View convertView, ViewGroup parent) {

		// flip the positions so the most recent pic shows up first
		int p = Math.abs(position - GalleryActivity.imageFiles.length + 1);

		ImageView imageView = new ImageView(mContext);

		// get a thumbnail
		BitmapFactory.Options bounds = new BitmapFactory.Options();
		bounds.inJustDecodeBounds = true;
		BitmapFactory.decodeFile(GalleryActivity.imageFiles[p].getPath(), bounds);
		if ((bounds.outWidth == -1) || (bounds.outHeight == -1))
			return null;
		int originalSize = (bounds.outHeight > bounds.outWidth) ? bounds.outHeight : bounds.outWidth;
		BitmapFactory.Options opts = new BitmapFactory.Options();
		// opts.inSampleSize = originalSize / 160;
		opts.inSampleSize = originalSize / 200;

		imageView.setLayoutParams(new android.widget.Gallery.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT));
//		imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
		imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
		imageView.setImageBitmap(BitmapFactory.decodeFile(GalleryActivity.imageFiles[p].getPath(), opts));

		return imageView;
	}
}