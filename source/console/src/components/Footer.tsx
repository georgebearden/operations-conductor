/*****************************************************************************
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.        *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License").           *
 * You may not use this file except in compliance with the License.          *
 * A copy of the License is located at                                       *
 *                                                                           *
 *     http://www.apache.org/licenses/LICENSE-2.0                            *
 *                                                                           *
 *  Unless required by applicable law or agreed to in writing, software      *
 *  distributed under the License is distributed on an "AS IS" BASIS,        *
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. *
 *  See the License for the specific language governing permissions and      *
 *  limitations under the License.                                           *
 ****************************************************************************/

import * as React from 'react';
import { Navbar, Nav, NavItem, Image} from 'react-bootstrap';

class Footer extends React.Component {
    render() {
        return (
            <footer key="footer">
                <Navbar className="custom-navbar">
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Image src="/images/logo.png" />
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <NavItem href="https://aws.amazon.com/solutions/">
                            AWS Solutions
                        </NavItem>
                    </Nav>
                </Navbar>
            </footer>
        );
    }
}

export default Footer;