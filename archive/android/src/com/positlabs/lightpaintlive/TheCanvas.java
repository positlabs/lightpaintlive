package com.positlabs.lightpaintlive;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Bitmap.Config;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.ImageFormat;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.PorterDuff;
import android.graphics.PorterDuff.Mode;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.YuvImage;
import android.hardware.Camera;
import android.hardware.Camera.CameraInfo;
import android.hardware.Camera.PreviewCallback;
import android.hardware.Camera.Size;
import android.os.Build;
import android.os.Environment;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.widget.ImageView;
import android.widget.Toast;

class TheCanvas extends SurfaceView implements SurfaceHolder.Callback {
	private static final String TAG = "TheCanvas";
	private final boolean ICS = Build.VERSION.SDK_INT >= 14;
	private Context ctx;

	private boolean _painting;

	private SurfaceHolder previewHolder;

	// private SurfaceView cvsContainer;

	private Camera _camera;

	private Matrix matrix;
	private Paint paint;
	private PorterDuff.Mode paintMode;

	private Point screensize;
	int captureWidth = 0;
	int captureHeight = 0;

	/** post frames to this thing when we're painting */
	private Bitmap paintBitmap;
	private ImageView paintview;
	private Canvas paintCanvas;

	private Boolean _previewActive = true;
	public int currentCameraIndex = 0;

	/** value for low-end threshold [0-255] */
	private float darkShift = 38f;

	/** value for alpha blending [0-1] */
	private float intensity = .1f;

	// TheCanvas(Context context, SurfaceView canvasContainer,
	// ImageView ppaintView, Point screenDimensions) {
	TheCanvas(Context context, ImageView ppaintView, Point screenDimensions) {
		super(context);
		Log.d(TAG, "TheCanvas");

		ctx = context;

		paintview = ppaintView;
		screensize = screenDimensions;

		previewHolder = getHolder();

		if (!ICS)
			previewHolder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);

		// cvsContainer = canvasContainer;

		// makes it so we can see through the canvas to the preview
		// cvsContainer.getHolder().setFormat(PixelFormat.TRANSPARENT);

		paintview = ppaintView;
		paintBitmap = Bitmap.createBitmap(screensize.x, screensize.y, Config.ARGB_8888);
		paintview.setImageBitmap(paintBitmap);
		paintCanvas = new Canvas(paintBitmap);

		paint = new Paint();
		// paint.setAlpha(15);
		paintMode = Mode.LIGHTEN;
		paint.setXfermode(new PorterDuffXfermode(paintMode));

		updateColorFilter();

		// Install a SurfaceHolder.Callback so we get notified when the
		// underlying surface is created and destroyed.
		previewHolder.addCallback(this);
	}

	// Called once the holder is ready
	public void surfaceCreated(SurfaceHolder holder) {
		Log.d(TAG, "surfaceCreated");

		// The Surface has been created, acquire the camera and tell it where
		// to draw.
		if (_camera == null)
			_camera = Camera.open();

		// if camera is null, connection failed.
		if (_camera == null)
			Toast.makeText(ctx, "Failed to connect to the camera. Restart your device and try again.", Toast.LENGTH_LONG).show();
		else {

			// continue setup
			Camera.Parameters cp = _camera.getParameters();
			// hide flash button if flash isn't supported
			if (cp.getFlashMode() == null)
				LPLAndroidNativeActivity.hideFlashBtn();

			// set camera parameters
			cp.setJpegQuality(100);
			_camera.setParameters(cp);

			List<Size> sizes = cp.getSupportedPreviewSizes();
			captureWidth = sizes.get(0).width;
			captureHeight = sizes.get(0).height;

			matrix = new Matrix();
			matrix.setScale((float) screensize.x / (float) captureWidth, (float) screensize.y / (float) captureHeight);

			try {
				_camera.setPreviewDisplay(previewHolder);
			} catch (IOException e) {
				e.printStackTrace();
			}
			_camera.startPreview();
		}
	}

	// Called when the holder is destroyed
	public void surfaceDestroyed(SurfaceHolder holder) {
		Log.d(TAG, "surfaceDestroyed");
	}

	public void releaseCamera() {
		Log.d(TAG, "releaseCamera");

		if (_camera != null) {
			// FIXME - try setting previewcallback to null before releasing
			// camera??
			// releasing the camera is what freezes the app on Joerg's phone.
			_camera.setPreviewCallback(null);
			_camera.stopPreview();
			_camera.release();
			_camera = null;
		}
	}

	// Called when holder has changed
	public void surfaceChanged(SurfaceHolder holder, int format, int w, int h) {
		Log.d(TAG, "surfaceChanged");
	}

	/** enterframe callback for painting */
	PreviewCallback paintingCallback = new PreviewCallback() {

		// Called for each frame previewed
		public void onPreviewFrame(byte[] data, Camera camera) {
			Log.d(TAG, "onPreviewFrame");

			// make a bitmap from the byte array
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			YuvImage yuvImage = new YuvImage(data, ImageFormat.NV21, captureWidth, captureHeight, null);
			yuvImage.compressToJpeg(new Rect(0, 0, captureWidth, captureHeight), 100, out);
			byte[] imageBytes = out.toByteArray();
			Bitmap image = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);

			// draw the frame onto the canvas
			paintCanvas.drawBitmap(image, matrix, paint);

			invalidate();
		}
	};
	PreviewCallback previewCallback = new PreviewCallback() {
		public void onPreviewFrame(byte[] data, Camera camera) {
		}
	};

	//
	//
	//
	// control functions
	//
	//
	//

	public void newPainting() {
		Log.d(TAG, "newPainting");
		paintBitmap = Bitmap.createBitmap(screensize.x, screensize.y, Config.ARGB_8888);
		paintview.setImageBitmap(paintBitmap);
		paintCanvas = new Canvas(paintBitmap);
		preview(true);
	}

	public void startPainting() {
		Log.d(TAG, "startPainting");
		_painting = true;
		_camera.setPreviewCallback(paintingCallback);
	}

	public void stopPainting() {
		Log.d(TAG, "stopPainting");
		_painting = false;
		if (_camera != null)
			_camera.setPreviewCallback(null);
		// camera.setPreviewCallback(previewCallback);
	}

	public void savePainting() {
		Toast.makeText(getContext(), "saving...", Toast.LENGTH_SHORT).show();

		ByteArrayOutputStream bytes = new ByteArrayOutputStream();
		paintBitmap.compress(Bitmap.CompressFormat.JPEG, 100, bytes);

		Calendar cal = Calendar.getInstance();
		Date date = cal.getTime();

		File f = new File(Environment.getExternalStorageDirectory() + "/DCIM/LightPaintLive/LPL_" + Integer.toString(date.getYear())
				+ Integer.toString(date.getMonth()) + Integer.toString(date.getDate()) + Integer.toString(date.getMinutes())
				+ Integer.toString(date.getSeconds()) + ".jpg");

		new File(Environment.getExternalStorageDirectory() + "/DCIM/LightPaintLive/").mkdirs();

		// write the bytes in file
		FileOutputStream fo;
		try {
			f.createNewFile();
			fo = new FileOutputStream(f);
			fo.write(bytes.toByteArray());
			Toast.makeText(getContext(), "saved to /DCIM/LightPaintLive/", Toast.LENGTH_SHORT).show();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * @param alpha
	 *            range 0-100
	 */
	public void setIntensity(float alpha) {
		// paint.setAlpha(value + 1);
		intensity = alpha / 100;
		updateColorFilter();
	}

	/** set value for low-end threshold [0-100] */
	public void setThreshold(float thresh) {
		// convert the input to a value range we can use
		// set max to 240 so we don't get a blackout
		darkShift = thresh * 240 / 100;
		updateColorFilter();
	}

	private void updateColorFilter() {
		ColorMatrix colorMatrix = new ColorMatrix();
		colorMatrix.set(new float[] { //
				//
						1f, 0, 0, 0, -darkShift, // R
						0, 1f, 0, 0, -darkShift, // G
						0, 0, 1f, 0, -darkShift, // B
						intensity, intensity, intensity, intensity, intensity // A
				});
		ColorFilter colorFilter = new ColorMatrixColorFilter(colorMatrix);
		paint.setColorFilter(colorFilter);
	}

	/** Turns the flash on for 300ms */
	public void flash() {
		Camera.Parameters cp = _camera.getParameters();
		if (cp.getFlashMode().equals(Camera.Parameters.FLASH_MODE_TORCH))
			cp.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);
		else
			cp.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);
		_camera.setParameters(cp);
	}

	public int nextCamera() {
		if (Camera.getNumberOfCameras() > 1) {
			_camera.stopPreview();
			_camera.release();
			_camera = null;
			currentCameraIndex = (currentCameraIndex + 1) % Camera.getNumberOfCameras();
			_camera = Camera.open(currentCameraIndex);

			// set camera parameters
			Camera.Parameters cp = _camera.getParameters();
			cp.setJpegQuality(100);
			_camera.setParameters(cp);

			List<Size> sizes = cp.getSupportedPreviewSizes();
			captureWidth = sizes.get(0).width;
			captureHeight = sizes.get(0).height;
			matrix = new Matrix();
			matrix.setScale((float) screensize.x / captureWidth, (float) screensize.y / captureHeight);

			try {
				_camera.setPreviewDisplay(previewHolder);
				_camera.startPreview();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		CameraInfo cameraInfo = new CameraInfo();
		Camera.getCameraInfo(currentCameraIndex, cameraInfo);

		// flip the matrix if it's the front camera
		if (cameraInfo.facing == CameraInfo.CAMERA_FACING_FRONT) {
			matrix.preScale(-1, 1);
			matrix.preTranslate(-captureWidth, 0);
		} else if (cameraInfo.facing == CameraInfo.CAMERA_FACING_BACK)
			matrix.setScale((float) screensize.x / (float) captureWidth, (float) screensize.y / (float) captureHeight);

		return cameraInfo.facing;
	}

	public void preview(Boolean active) {
		Log.d(TAG, active.toString());
		// try {
		if (active) {
			_previewActive = true;
			paintview.setAlpha(220);
			// camera.setPreviewDisplay(null);

		} else {
			_previewActive = false;
			paintview.setAlpha(255);
			// camera.setPreviewDisplay(previewHolder);
		}
		// } catch (IOException e) {
		// e.printStackTrace();
		// }
	}

	public String switchPaintMode() {
		if (paintMode.equals(PorterDuff.Mode.SCREEN)) {
			paintMode = Mode.LIGHTEN;
			paint.setXfermode(new PorterDuffXfermode(paintMode));
			return "lighten";
		} else {
			paintMode = Mode.SCREEN;
			paint.setXfermode(new PorterDuffXfermode(paintMode));
			return "screen";
		}

	}

	public boolean isPainting() {
		return _painting;
	}

	public boolean previewActive() {
		return _previewActive;
	}

	public Camera camera() {
		return _camera;
	}

}