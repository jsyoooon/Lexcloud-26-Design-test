import React from 'react';
import '../../styles/style.css';

// Using relative paths for images as they are now in src/assets/img
import arrowRight from '../../assets/img/icon/icon/navigation/icon/arrow-right1.svg';
import notiIcon from '../../assets/img/icon/icon/navigation/noti_2_off.svg';
import folderIcon from '../../assets/img/icon/icon/navigation/folder.svg';
import homeIcon from '../../assets/img/icon/icon/navigation/home.svg';
import quoteIcon from '../../assets/img/icon/icon/navigation/quote.svg';
import usersIcon from '../../assets/img/icon/icon/navigation/Users.svg';
import penIcon from '../../assets/img/icon/icon/navigation/Pen.svg';
import creditIcon from '../../assets/img/icon/icon/navigation/credit.svg';
import creditCheckIcon from '../../assets/img/icon/icon/navigation/Credit Card Check.svg';
import dbIcon from '../../assets/img/icon/icon/navigation/Database.svg';
import frameIcon from '../../assets/img/icon/icon/navigation/Frame.svg';
import msgIcon from '../../assets/img/icon/icon/navigation/message.svg';
import activityIcon from '../../assets/img/icon/icon/navigation/Activity Square.svg';

export default function Sidebar() {
  return (
    <div className="main-navigation">
      <div className="contents">
        <div className="btn-side-panel-right">
          <img className="icon-arrow" src={arrowRight} alt="arrow" />
        </div>
        <div className="frame">
          <div className="div">
            <img className="img" src={notiIcon} alt="noti" />
          </div>

          <div className="div">
            <img className="img" src={folderIcon} alt="folder" />
          </div>
          <div className="div">
            <div className="img">
              <img className="union" src={homeIcon} alt="home" />
            </div>
          </div>
          <div className="div">
            <img className="img" src={quoteIcon} alt="quote" />
          </div>
          <div className="div">
            <img className="img-2" src={usersIcon} alt="users" />
          </div>
          <div className="div">
            <img className="img-2" src={penIcon} alt="pen" />
          </div>
          <div className="div">
            <img className="img" src={creditIcon} alt="credit" />
          </div>
          <div className="div">
            <img className="img-2" src={creditCheckIcon} alt="credit check" />
          </div>
          <div className="div">
            <img className="img-2" src={dbIcon} alt="db" />
          </div>
          <div className="div">
            <img className="img-2" src={frameIcon} alt="frame" />
          </div>
          <div className="div">
            <img className="img" src={msgIcon} alt="msg" />
          </div>
          <div className="div">
            <img className="img-2" src={activityIcon} alt="activity" />
          </div>
        </div>
      </div>
      <div className="avatar">
        <div className="text-wrapper">B</div>
      </div>
    </div>
  );
}
