import GoogleAdsStats from "@/src/components/admin/Integrations/GoogleAdsStats";
import Messages from "@/src/components/admin/Messages";
import React from "react";
import VisitorStats from "@/src/components/admin/VisitorStats";
import AdminLayout from "@/src/layouts/AdminLayout";
import styles from "@/src/styles/layouts/AdminLayout.module.scss";

const AdminView: React.FC = () => {
  return (
    <AdminLayout>
      <div className={styles.leftContainer}>
        <GoogleAdsStats />
        <VisitorStats />
      </div>
      <div className={styles.rightContainer}>
        <Messages />
      </div>
    </AdminLayout>
  );
};

export default AdminView;
