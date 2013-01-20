package com.positlabs.lightpaintlive;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Point;
import android.hardware.Camera;
import android.hardware.Camera.CameraInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Environment;
import android.os.Vibrator;
import android.util.Log;
import android.view.Display;
import android.view.SurfaceView;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.WindowManager;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.Animation.AnimationListener;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.SeekBar;
import android.widget.SeekBar.OnSeekBarChangeListener;

import com.positlabs.billing.Dungeons;

public class LPLAndroidNativeActivity extends Activity {
	private final boolean ICS = Build.VERSION.SDK_INT >= 14;
	// private static final int SELECT_IMAGE = 615;

	private static String TAG = "LPLAndroidNativeActivity";

	private static TheCanvas canvas;
	// private SurfaceView canvasContainer;
	private FrameLayout previewContainer;
	private ImageView paintView;
	private Vibrator vibrator;

	private ScrollView controls;
	private LinearLayout controlsGroup;
	private static Button modeBtn;
	private static Button flashBtn;
	private Button newBtn;
	private Button saveBtn;
	private Button previewBtn;
	private static Button upgradeBtn;
	private static Button switchCamBtn;
	private Button countdownDisplay;
	private Button menuBtn;
	private Button controlsBtn;
	private SeekBar timerSlider;
	private SeekBar thresholdSlider;
	private SeekBar intensitySlider;
	private static LinearLayout timerSliderGroup;

	private CountDownTimer countdownTimer;
	private int startDelay = 0;
	private boolean countingDown;

	private Display display;
	private Point size;

	private Animation fadeIn;
	private Animation fadeOut;

	private Dungeons biller;
	private static Boolean upgraded = false;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		Log.d(TAG, "onCreate()");
		Log.d(TAG, "ICS: " + ICS);
		super.onCreate(savedInstanceState);
		setContentView(R.layout.test);

		biller = new Dungeons(getApplicationContext(), this);

		// prevent screen from turning off or dimming
		getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

		vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);

		paintView = (ImageView) findViewById(R.id.paintView);
		// canvasContainer = (SurfaceView) findViewById(R.id.canvasContainer);
		previewContainer = (FrameLayout) findViewById(R.id.previewContainer);

		display = getWindowManager().getDefaultDisplay();
		size = new Point();

		if (ICS) {
			display.getSize(size);
		} else {
			// < 4.0.0
			size.x = display.getWidth();
			size.y = display.getHeight();
		}

		controls = (ScrollView) findViewById(R.id.controls);
		controlsGroup = (LinearLayout) findViewById(R.id.controlsGroup);
		controlsBtn = (Button) findViewById(R.id.controlsBtn);
		newBtn = (Button) findViewById(R.id.newBtn);
		saveBtn = (Button) findViewById(R.id.saveBtn);
		previewBtn = (Button) findViewById(R.id.previewBtn);
		upgradeBtn = (Button) findViewById(R.id.upgradeBtn);
		switchCamBtn = (Button) findViewById(R.id.switchCamBtn);
		flashBtn = (Button) findViewById(R.id.flashBtn);
		modeBtn = (Button) findViewById(R.id.modeBtn);
		countdownDisplay = (Button) findViewById(R.id.countdownDisplay);
		menuBtn = (Button) findViewById(R.id.menuBtn);
		timerSliderGroup = (LinearLayout) findViewById(R.id.timerSliderGroup);

		fadeIn = new AlphaAnimation(0.0f, 1.0f);
		fadeIn.setDuration(800);
		fadeOut = new AlphaAnimation(1.0f, 0.0f);
		fadeOut.setDuration(300);
		fadeOut.setAnimationListener(new AnimationListener() {

			@Override
			public void onAnimationStart(Animation animation) {
			}

			@Override
			public void onAnimationRepeat(Animation animation) {
			}

			@Override
			public void onAnimationEnd(Animation animation) {
				controls.setVisibility(View.GONE);

				// only show controls button if not painting or counting down
				if (!canvas.isPainting() && !countingDown) {
					controlsBtn.setVisibility(View.VISIBLE);
					controlsBtn.startAnimation(fadeIn);
				} else {
					controlsBtn.setVisibility(View.GONE);
				}
			}
		});

		setupClickListeners();
	}

	// Intent goToMarket = new Intent(Intent.ACTION_VIEW,
	// Uri.parse("market://details?id=air.com.positlabs.mobile.lightPaintLive"));

	private void setupClickListeners() {
		Log.d(TAG, "setupClickListeners()");
		controlsBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				vibrator.vibrate(50);
				if (controls.getVisibility() == View.VISIBLE) {
					controlsBtn.setVisibility(View.GONE);
					controls.startAnimation(fadeOut);
					// controls.setVisibility(View.GONE);
				} else {
					controls.setVisibility(View.VISIBLE);
					controlsGroup.startAnimation(fadeIn);
				}
			}
		});
		newBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				vibrator.vibrate(50);
				canvas.newPainting();
				preview(true);
			}
		});

		saveBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				vibrator.vibrate(50);
				canvas.savePainting();
				sendBroadcast(new Intent(Intent.ACTION_MEDIA_MOUNTED, Uri.parse("file://" + Environment.getExternalStorageDirectory())));
			}
		});

		flashBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				vibrator.vibrate(50);
				canvas.flash();
			}
		});

		modeBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				vibrator.vibrate(50);
				modeBtn.setText("mode: " + canvas.switchPaintMode());
			}
		});

		upgradeBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				vibrator.vibrate(50);
				biller.buyUpgrade();
			}
		});

		previewBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				vibrator.vibrate(50);
				preview(!canvas.previewActive());
			}
		});
		menuBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				vibrator.vibrate(50);
				// openOptionsMenu();
				Intent intent = new Intent(LPLAndroidNativeActivity.this, GalleryActivity.class);
				intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				startActivity(intent);
			}
		});

		switchCamBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				vibrator.vibrate(50);
				preview(true);

				int camID = canvas.nextCamera();
				if (canvas.camera().getParameters().getFlashMode() == null)
					flashBtn.setVisibility(View.GONE);
				else if (camID == Camera.CameraInfo.CAMERA_FACING_BACK)
					flashBtn.setVisibility(View.VISIBLE);
				else
					flashBtn.setVisibility(View.GONE);
			}
		});

		intensitySlider = (SeekBar) findViewById(R.id.intensitySlider);
		intensitySlider.setProgress(15);
		intensitySlider.setOnSeekBarChangeListener(new OnSeekBarChangeListener() {

			@Override
			public void onStopTrackingTouch(SeekBar seekBar) {
				canvas.setIntensity((float) seekBar.getProgress());
			}

			@Override
			public void onStartTrackingTouch(SeekBar seekBar) {
			}

			@Override
			public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
			}
		});
		thresholdSlider = (SeekBar) findViewById(R.id.thresholdSlider);
		thresholdSlider.setProgress(15);
		thresholdSlider.setOnSeekBarChangeListener(new OnSeekBarChangeListener() {

			@Override
			public void onStopTrackingTouch(SeekBar seekBar) {
				canvas.setThreshold(seekBar.getProgress());
			}

			@Override
			public void onStartTrackingTouch(SeekBar seekBar) {
			}

			@Override
			public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
			}
		});

		timerSlider = (SeekBar) findViewById(R.id.timerSlider);
		timerSlider.setOnSeekBarChangeListener(new OnSeekBarChangeListener() {

			@Override
			public void onStopTrackingTouch(SeekBar seekBar) {
			}

			@Override
			public void onStartTrackingTouch(SeekBar seekBar) {
			}

			@Override
			public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
				startDelay = progress;
			}
		});
	}

	@Override
	protected void onResume() {
		super.onResume();
		Log.d(TAG, "onResume()");

		checkUpgrade();

		if (canvas != null) {
			Log.d(TAG, "canvas != null");
			// ensure controls are visible
			controlsGroup.setVisibility(View.VISIBLE);

			// ensure canvas variables match slider values
			canvas.setThreshold(thresholdSlider.getProgress());
			canvas.setIntensity(intensitySlider.getProgress());

		} else if (canvas == null) {
			Log.d(TAG, "canvas == null");

			canvas = new TheCanvas(getApplicationContext(), paintView, size);
			previewContainer.addView((SurfaceView) canvas);

			paintView.setOnClickListener(new OnClickListener() {

				@Override
				public void onClick(View v) {
					Log.d(TAG, "paintView.onClick");
					vibrator.vibrate(50);

					if (canvas.isPainting()) {
						// stop painting
						controlsGroup.setVisibility(View.VISIBLE);
						controlsBtn.setVisibility(View.VISIBLE);
						canvas.stopPainting();
					} else {

						if (startDelay == 0) {
							// countdown is inactive, just start
							startPainting();

						} else if (startDelay > 0) {
							if (countingDown) {
								// stop the countdown if tapped while in
								// progress
								countingDown = false;
								controlsGroup.setVisibility(View.VISIBLE);
								countdownTimer.cancel();
								findViewById(R.id.countdownDisplay).setVisibility(View.GONE);
							} else if (!countingDown) {

								// else start the countdown
								countingDown = true;
								controlsGroup.setVisibility(View.GONE);
								countdownDisplay.setText(Integer.toString(startDelay));
								countdownDisplay.setVisibility(View.VISIBLE);
								countdownTimer = new CountDownTimer(startDelay * 1000 + 1000, 1000) {

									@Override
									public void onTick(long millisUntilFinished) {
										countdownDisplay.setText(Long.toString(millisUntilFinished / 1000));
									}

									@Override
									public void onFinish() {
										countdownDisplay.setVisibility(View.GONE);
										startPainting();
										countingDown = false;
									}
								};
								countdownTimer.start();
							}
						}
					}
				}
			});

		}
	}

	/** sets button visibility based on upgrade status */
	private static void checkUpgrade() {
		if (upgraded) {
			upgradeBtn.setVisibility(View.GONE);

			// enable if backcam is current
			CameraInfo cameraInfo = new CameraInfo();
			Camera.getCameraInfo(canvas.currentCameraIndex, cameraInfo);
			if (cameraInfo.facing == CameraInfo.CAMERA_FACING_BACK)
				flashBtn.setVisibility(View.VISIBLE);

			switchCamBtn.setVisibility(View.VISIBLE);
			modeBtn.setVisibility(View.VISIBLE);
			timerSliderGroup.setVisibility(View.VISIBLE);
		} else {
			upgradeBtn.setVisibility(View.VISIBLE);
			flashBtn.setVisibility(View.GONE);
			switchCamBtn.setVisibility(View.GONE);
			modeBtn.setVisibility(View.GONE);
			timerSliderGroup.setVisibility(View.GONE);
		}
	}

	private void startPainting() {
		controlsGroup.startAnimation(fadeOut);
		canvas.startPainting();
		preview(false);
	}

	/** enable or disable the preview */
	private void preview(Boolean active) {
		canvas.preview(active);
		if (active) {
			findViewById(R.id.previewBlocker).setVisibility(View.GONE);
		} else {
			findViewById(R.id.previewBlocker).setVisibility(View.VISIBLE);
		}
	}

	public static void hideFlashBtn() {
		// hide flash button if flash isn't supported
		flashBtn.setVisibility(View.GONE);
	}

	@Override
	protected void onStart() {
		super.onStart();
		biller.onStart();
	}

	@Override
	protected void onStop() {
		Log.d(TAG, "onStop");
		biller.onStop();
		canvas.stopPainting();
		canvas.releaseCamera();
		// canvas = null;
		super.onStop();
	}

	@Override
	protected void onPause() {
		Log.d(TAG, "onPause");
		canvas.stopPainting();
		canvas.releaseCamera();
		super.onPause();
	}

	@Override
	protected void onDestroy() {
		Log.d(TAG, "onDestroy");
		biller.onDestroy();
		canvas.stopPainting();
		canvas.releaseCamera();
		canvas = null;
		super.onDestroy();
	}

	/** called by the biller once it sees that the user has bought the upgrade */
	public static void enableUpgradeFeatures() {
		Log.d(TAG, "enableUpgradeFeatures");
		upgraded = true;
		checkUpgrade();
	}

}