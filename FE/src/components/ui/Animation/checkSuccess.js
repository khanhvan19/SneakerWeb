import styles from './checkSuccess.module.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function CheckSuccess() {
    return (
        <div className={cx("success-checkmark")}>
            <div className={cx("check-icon")}>
                <span className={cx("icon-line","line-tip")}></span>
                <span className={cx("icon-line","line-long")}></span>
                <div className={cx("icon-circle")}></div>
                <div className={cx("icon-fix")}></div>
            </div>
        </div>
    );
}

export default CheckSuccess;