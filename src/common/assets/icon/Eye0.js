/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.0037 18.2145C12.7188 18.2145 13.3991 18.15 14.0447 18.0209C14.6903 17.8967 15.3085 17.7254 15.8994 17.5069L15.1397 16.7471C14.653 16.911 14.149 17.0426 13.6276 17.1419C13.1111 17.2412 12.5698 17.2909 12.0037 17.2909C11.1546 17.2909 10.3451 17.1866 9.57542 16.978C8.80571 16.7645 8.08566 16.4839 7.41527 16.1363C6.74985 15.7887 6.14649 15.4113 5.60521 15.0041C5.0689 14.592 4.60708 14.1847 4.21974 13.7825C3.8324 13.3753 3.53445 13.0054 3.32588 12.6726C3.12228 12.3399 3.02048 12.0817 3.02048 11.898C3.02048 11.749 3.1049 11.533 3.27374 11.2499C3.44258 10.9669 3.68591 10.6466 4.00372 10.289C4.32651 9.92652 4.71633 9.55657 5.17318 9.17916C5.63004 8.79679 6.14401 8.43677 6.71508 8.09909L6 7.37656C5.3743 7.75893 4.81316 8.16613 4.31657 8.59816C3.82495 9.03019 3.40534 9.45725 3.05773 9.87935C2.71508 10.2965 2.45189 10.6813 2.26816 11.0339C2.08939 11.3865 2 11.6745 2 11.898C2 12.1463 2.11173 12.474 2.3352 12.8812C2.55866 13.2834 2.87896 13.7229 3.29609 14.1996C3.71819 14.6714 4.22471 15.1432 4.81564 15.6149C5.40658 16.0867 6.07449 16.5187 6.81937 16.911C7.56425 17.3033 8.3712 17.6186 9.24022 17.857C10.1092 18.0954 11.0304 18.2145 12.0037 18.2145ZM12.0037 5.5814C11.3135 5.5814 10.6654 5.64347 10.0596 5.76762C9.45872 5.8868 8.87027 6.05067 8.29423 6.25924L9.054 7.01157C9.52079 6.85762 9.99255 6.73596 10.4693 6.64657C10.946 6.55222 11.4575 6.50505 12.0037 6.50505C12.8479 6.50505 13.6549 6.6143 14.4246 6.83279C15.1993 7.04633 15.9193 7.32938 16.5847 7.68196C17.2551 8.03453 17.8585 8.41939 18.3948 8.83652C18.9311 9.24868 19.3904 9.66085 19.7728 10.073C20.1601 10.4802 20.4581 10.8452 20.6667 11.168C20.8752 11.4908 20.9795 11.7341 20.9795 11.898C20.9795 12.0618 20.8976 12.2853 20.7337 12.5684C20.5698 12.8514 20.3315 13.1692 20.0186 13.5218C19.7107 13.8694 19.3383 14.227 18.9013 14.5944C18.4643 14.9619 17.9727 15.312 17.4264 15.6447L18.1415 16.3598C18.7374 15.9774 19.2737 15.5727 19.7505 15.1456C20.2322 14.7186 20.6394 14.3014 20.9721 13.8942C21.3048 13.4821 21.558 13.1022 21.7318 12.7546C21.9106 12.402 22 12.1165 22 11.898C22 11.6497 21.8883 11.3244 21.6648 10.9222C21.4463 10.515 21.1285 10.0755 20.7114 9.60374C20.2942 9.12702 19.7902 8.65278 19.1993 8.18103C18.6083 7.70927 17.9404 7.27724 17.1955 6.88494C16.4556 6.49263 15.6487 6.1773 14.7747 5.93894C13.9056 5.70058 12.982 5.5814 12.0037 5.5814ZM12.0037 16.0618C12.3613 16.0618 12.7064 16.0172 13.0391 15.9278C13.3718 15.8334 13.6872 15.7043 13.9851 15.5404L8.33147 9.89425C8.1676 10.1872 8.04097 10.5026 7.95158 10.8402C7.8622 11.1779 7.8175 11.5305 7.8175 11.898C7.82247 12.4641 7.93172 13.0004 8.14525 13.5069C8.35878 14.0085 8.65673 14.4504 9.03911 14.8328C9.42148 15.2152 9.86344 15.5156 10.365 15.7341C10.8715 15.9526 11.4178 16.0618 12.0037 16.0618ZM15.7058 13.7527C15.8547 13.4796 15.969 13.1866 16.0484 12.8738C16.1328 12.5559 16.175 12.2307 16.175 11.898C16.175 11.317 16.0658 10.7757 15.8473 10.2741C15.6338 9.76762 15.3358 9.32566 14.9534 8.94825C14.5711 8.56588 14.1266 8.26793 13.6201 8.0544C13.1136 7.84086 12.5748 7.7341 12.0037 7.7341C11.666 7.7341 11.3383 7.77382 11.0205 7.85328C10.7076 7.93273 10.4146 8.04446 10.1415 8.18847L15.7058 13.7527ZM17.9404 18.3561C18.0248 18.4455 18.1266 18.4902 18.2458 18.4902C18.37 18.4951 18.4767 18.4504 18.5661 18.3561C18.6605 18.2617 18.7052 18.155 18.7002 18.0358C18.6952 17.9216 18.6505 17.8198 18.5661 17.7304L5.95531 5.12702C5.87089 5.0426 5.7666 5.00039 5.64246 5.00039C5.51831 4.99543 5.41155 5.03764 5.32216 5.12702C5.23774 5.21144 5.19553 5.31572 5.19553 5.43987C5.19553 5.56402 5.23774 5.6683 5.32216 5.75272L17.9404 18.3561Z" fill="currentColor"/>
</svg>
`

let Eye0 = ({ size, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Eye0.defaultProps = {
  size: 18,
};

Eye0 = React.memo ? React.memo(Eye0) : Eye0;

export default Eye0;
