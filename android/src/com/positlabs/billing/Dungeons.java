package com.positlabs.billing;

import java.util.HashSet;
import java.util.Set;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.os.Handler;
import android.util.Log;
import android.widget.Toast;

import com.positlabs.billing.BillingService.RequestPurchase;
import com.positlabs.billing.BillingService.RestoreTransactions;
import com.positlabs.billing.Consts.PurchaseState;
import com.positlabs.billing.Consts.ResponseCode;
import com.positlabs.lightpaintlive.LPLAndroidNativeActivity;

/**
 * A sample application that demonstrates in-app billing.
 */
public class Dungeons {
	private static final String TAG = "Dungeons";

	/**
	 * The SharedPreferences key for recording whether we initialized the
	 * database. If false, then we perform a RestoreTransactions request to get
	 * all the purchases for this user.
	 */
	private static final String DB_INITIALIZED = "db_initialized";

	/** sku of the upgrade item */
	private static final String LPL_UPGRADE = "lpl_upgrade";

	private DungeonsPurchaseObserver mDungeonsPurchaseObserver;
	private Handler mHandler;

	private BillingService mBillingService;
	private PurchaseDatabase mPurchaseDatabase;
	private Cursor mOwnedItemsCursor;
	private Set<String> mOwnedItems = new HashSet<String>();

	/**
	 * A {@link PurchaseObserver} is used to get callbacks when Android Market
	 * sends messages to this application so that we can update the UI.
	 */
	private class DungeonsPurchaseObserver extends PurchaseObserver {
		public DungeonsPurchaseObserver(Handler handler) {
			super(activity, handler);
		}

		@Override
		public void onBillingSupported(boolean supported) {
			Log.d(TAG, "onBillingSupported: " + supported);
			if (Consts.DEBUG) {
				Log.i(TAG, "supported: " + supported);
			}
			if (supported) {
				restoreDatabase();
			}
		}

		@Override
		public void onPurchaseStateChange(PurchaseState purchaseState,
				String itemId, int quantity, long purchaseTime,
				String developerPayload) {
			if (Consts.DEBUG) {
				Log.i(TAG, "onPurchaseStateChange() itemId: " + itemId + " "
						+ purchaseState);
			}

			if (developerPayload == null) {
				logProductActivity(itemId, purchaseState.toString());
			} else {
				logProductActivity(itemId, purchaseState + "\n\t"
						+ developerPayload);
			}

			if (purchaseState == PurchaseState.PURCHASED) {
				mOwnedItems.add(itemId);
			}
			mOwnedItemsCursor.requery();
		}

		@Override
		public void onRequestPurchaseResponse(RequestPurchase request,
				ResponseCode responseCode) {
			if (Consts.DEBUG) {
				Log.d(TAG, request.mProductId + ": " + responseCode);
			}
			if (responseCode == ResponseCode.RESULT_OK) {
				if (Consts.DEBUG) {
					Log.i(TAG, "purchase was successfully sent to server");
				}
				logProductActivity(request.mProductId,
						"sending purchase request");
			} else if (responseCode == ResponseCode.RESULT_USER_CANCELED) {
				if (Consts.DEBUG) {
					Log.i(TAG, "user canceled purchase");
				}
				logProductActivity(request.mProductId,
						"dismissed purchase dialog");
			} else {
				if (Consts.DEBUG) {
					Log.i(TAG, "purchase failed");
				}
				logProductActivity(request.mProductId,
						"request purchase returned " + responseCode);
			}
		}

		@Override
		public void onRestoreTransactionsResponse(RestoreTransactions request,
				ResponseCode responseCode) {
			if (responseCode == ResponseCode.RESULT_OK) {
				if (Consts.DEBUG) {
					Log.d(TAG, "completed RestoreTransactions request");
				}
				// Update the shared preferences so that we don't perform
				// a RestoreTransactions again.
				SharedPreferences prefs = activity
						.getPreferences(Context.MODE_PRIVATE);
				SharedPreferences.Editor edit = prefs.edit();
				edit.putBoolean(DB_INITIALIZED, true);
				edit.commit();
			} else {
				if (Consts.DEBUG) {
					Log.d(TAG, "RestoreTransactions error: " + responseCode);
				}
			}
		}
	}

	private String mItemName;
	private String mSku;
	private Context ctx;

	private Activity activity;

	/** Called when the activity is first created. */
	public Dungeons(Context pCtx, Activity pActivity) {

		Log.d(TAG, "Dungeons()");

		activity = pActivity;
		ctx = pCtx;

		mHandler = new Handler();
		mDungeonsPurchaseObserver = new DungeonsPurchaseObserver(mHandler);
		mBillingService = new BillingService();
		mBillingService.setContext(ctx);

		mPurchaseDatabase = new PurchaseDatabase(ctx);

		// Check if billing is supported.
		ResponseHandler.register(mDungeonsPurchaseObserver);
		if (!mBillingService.checkBillingSupported()) {
			// showDialog(DIALOG_CANNOT_CONNECT_ID);
			Log.e(TAG, "can't connect to billing...billing not supported");
		}
	}

	/**
	 * Called when this activity becomes visible.
	 */
	public void onStart() {
		ResponseHandler.register(mDungeonsPurchaseObserver);
		initializeOwnedItems();
	}

	/**
	 * Called when this activity is no longer visible.
	 */
	public void onStop() {
		ResponseHandler.unregister(mDungeonsPurchaseObserver);
	}

	public void onDestroy() {
		mPurchaseDatabase.close();
		mBillingService.unbind();
	}

	private void logProductActivity(String product, String activity) {
		Log.d(TAG, product + "\n" + activity);
	}

	/**
	 * If the database has not been initialized, we send a RESTORE_TRANSACTIONS
	 * request to Android Market to get the list of purchased items for this
	 * user. This happens if the application has just been installed or the user
	 * wiped data. We do not want to do this on every startup, rather, we want
	 * to do only when the database needs to be initialized.
	 */
	private void restoreDatabase() {
		Log.d(TAG, "restoreDatabase()");

		SharedPreferences prefs = activity
				.getPreferences(Activity.MODE_PRIVATE);
		boolean initialized = prefs.getBoolean(DB_INITIALIZED, false);
		if (!initialized) {
			mBillingService.restoreTransactions();
			 Toast.makeText(ctx, "restoring transactions", Toast.LENGTH_LONG).show();
		}
	}

	/**
	 * Creates a background thread that reads the database and initializes the
	 * set of owned items.
	 */
	private void initializeOwnedItems() {
		new Thread(new Runnable() {
			public void run() {
				doInitializeOwnedItems();
			}
		}).start();
	}

	/**
	 * Reads the set of purchased items from the database in a background thread
	 * and then adds those items to the set of owned items in the main UI
	 * thread.
	 */
	private void doInitializeOwnedItems() {
		Cursor cursor = mPurchaseDatabase.queryAllPurchasedItems();
		if (cursor == null) {
			return;
		}

		final Set<String> ownedItems = new HashSet<String>();
		try {
			int productIdCol = cursor
					.getColumnIndexOrThrow(PurchaseDatabase.PURCHASED_PRODUCT_ID_COL);
			while (cursor.moveToNext()) {
				String productId = cursor.getString(productIdCol);
				ownedItems.add(productId);
			}
		} finally {
			cursor.close();
		}

		// We will add the set of owned items in a new Runnable that runs on
		// the UI thread so that we don't need to synchronize access to
		// mOwnedItems.
		mHandler.post(new Runnable() {
			public void run() {
				mOwnedItems.addAll(ownedItems);
				Log.d(TAG, mOwnedItems.toString());
				Log.d(TAG, "upgrade purchased? " + mOwnedItems.contains(LPL_UPGRADE));

				if (mOwnedItems.contains(LPL_UPGRADE))
					LPLAndroidNativeActivity.enableUpgradeFeatures();
			}
		});
	}

	/**
	 * Called when the buy button is pressed.
	 */
	public void buyUpgrade() {
		if (!mBillingService.requestPurchase(LPL_UPGRADE, "")) {
			Log.e(TAG, "billing not supported!!!!!!!!!!!!");
		}
		Log.d(TAG, "buying: " + mItemName + " sku: " + mSku);
	}

}
