// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Kyc {
    address public admin;
    struct Customer {
        address custAddress;
        string name;
        string fatherName;
        string motherName;
        string grandfatherName;
        string temporaryAddress;
        string permanenetAddress;
        string contactNumber;
        string dob;
        uint256 d;
        uint256 n;
        Organization[] organization;
        bool kycStatus;
    }

    struct Organization {
        string name;
        address ethAddress;
    }

    struct kycRequest {
        address ethAddress;
        uint256 req_count;
        kycRequestList[] kycrequestlist;
    }

    struct kycRequestList {
        uint256 req_count;
        address Address;
    }

    struct kycRequestCust {
        kycRequestList[] kycrequestlist;
        address custAddress;
    }

    constructor() {
        admin = msg.sender;
    }

    mapping(address => Customer) customers;
    mapping(address => Organization) organizations;
    mapping(address => kycRequest) kycrequestsbyorg;
    mapping(address => kycRequestCust) kycrequestsbycust;

    int public organizationsCount = 0;

    event orgAdded(string name, address ethAddress);
    event orgRemoved(address ethAddress);
    event customerAdded(address custAddress, bool kycStatus);
    event customerUpdated(address custAddress, bool kycStatus);

    event requestRemoved(uint256 reqid, address ethAddress);

    // Checks whether the requestor is admin
    modifier isAdmin() {
        require(admin == msg.sender, "Admin only");
        _;
    }

    // Checks wheter the org exists or not
    modifier isOrgValid() {
        require(
            organizations[msg.sender].ethAddress == msg.sender,
            "Org not exist"
        );
        _;
    }

    //Check if Org has access to the user KYC
    function findOrg(
        address _custaddress,
        address ethAddress
    ) internal view returns (bool) {
        uint256 i = 0;
        for (i; i < customers[_custaddress].organization.length; i++) {
            if (
                customers[_custaddress].organization[i].ethAddress == ethAddress
            ) {
                return true;
            }
        }
        return false;
    }

    //Find the index of Org in KYC.organization array
    function findOrgIndex(
        address _custaddress,
        address ethAddress
    ) internal view returns (uint256 index) {
        uint256 i = 0;
        for (i; i < customers[_custaddress].organization.length; i++) {
            if (
                customers[_custaddress].organization[i].ethAddress == ethAddress
            ) {
                return i;
            }
        }
    }

    function findRequestIndex(
        address _custaddress,
        address _ethAddress
    ) internal view returns (uint256 index) {
        uint256 i = 0;
        for (
            i;
            i < kycrequestsbycust[_custaddress].kycrequestlist.length;
            i++
        ) {
            if (
                kycrequestsbycust[_custaddress].kycrequestlist[i].Address ==
                _ethAddress
            ) {
                return i;
            }
        }
    }

    //Check if request exist
    function findRequest(address _custaddress) internal view returns (bool) {
        uint256 i = 0;
        for (i; i < kycrequestsbyorg[msg.sender].req_count; i++) {
            if (
                kycrequestsbyorg[msg.sender].kycrequestlist[i].Address ==
                _custaddress
            ) {
                return true;
            }
        }
        return false;
    }

    //Add organization ONLY BY ADMIN
    function addOrg(
        string memory _name,
        address _ethAddress
    ) public isAdmin returns (bool) {
        require(
            organizations[_ethAddress].ethAddress != _ethAddress,
            "Org already added"
        );
        organizations[_ethAddress] = Organization(_name, _ethAddress);
        kycrequestsbyorg[_ethAddress].ethAddress = _ethAddress;
        kycrequestsbyorg[_ethAddress].req_count = 0;
        organizationsCount += 1;
        emit orgAdded(_name, _ethAddress);
        return true;
    }

    //Remove Organization ONLY BY ADMIN
    function removeOrg(address _ethAddress) public isAdmin returns (bool) {
        require(
            organizations[_ethAddress].ethAddress == _ethAddress,
            "Org doesnt exist"
        );
        delete organizations[_ethAddress];
        organizationsCount -= 1;
        emit orgRemoved(_ethAddress);
        return true;
    }

    //Return Organization Info if it exists
    function viewOrg(
        address _ethAddress
    ) public view isAdmin returns (Organization memory) {
        require(
            organizations[_ethAddress].ethAddress == _ethAddress,
            "Org doesnt exist"
        );
        return organizations[_ethAddress];
    }

    function getYourOrgDetail()
        public
        view
        isOrgValid
        returns (Organization memory)
    {
        return organizations[msg.sender];
    }

    function validOrg() public view returns (bool) {
        if (organizations[msg.sender].ethAddress == msg.sender) {
            return true;
        } else {
            return false;
        }
    }

    function validAdmin() public view returns (bool) {
        if (admin == msg.sender) {
            return true;
        } else {
            return false;
        }
    }

    function validCust() public view returns (bool) {
        if (customers[msg.sender].custAddress == msg.sender) {
            return true;
        } else {
            return false;
        }
    }

    function writeKYC(
        address _custaddress,
        string memory name,
        string memory fatherName,
        string memory motherName,
        string memory grandfatherName,
        string memory temporaryAddress,
        string memory permanenetAddress,
        string memory contactNumber,
        string memory dob,
        bool _kycStatus,
        uint256 _d,
        uint256 _n
    ) internal {
        customers[_custaddress].custAddress = _custaddress;
        customers[_custaddress].name = name;
        customers[_custaddress].fatherName = fatherName;
        customers[_custaddress].motherName = motherName;
        customers[_custaddress].grandfatherName = grandfatherName;
        customers[_custaddress].temporaryAddress = temporaryAddress;
        customers[_custaddress].permanenetAddress = permanenetAddress;
        customers[_custaddress].contactNumber = contactNumber;
        customers[_custaddress].dob = dob;
        customers[_custaddress].kycStatus = _kycStatus;
        customers[_custaddress].d = _d;
        customers[_custaddress].n = _n;

        kycrequestsbycust[_custaddress].custAddress = _custaddress;
    }

    //Register User KYC by registered Orgs
    function registerKYC(
        address _custaddress,
        string memory name,
        string memory fatherName,
        string memory motherName,
        string memory grandfatherName,
        string memory temporaryAddress,
        string memory permanenetAddress,
        string memory contactNumber,
        string memory dob,
        bool _kycStatus,
        uint256 _d,
        uint256 _n
    ) public isOrgValid returns (bool) {
        require(
            customers[_custaddress].custAddress != _custaddress,
            "User already exists"
        );
        writeKYC(
            _custaddress,
            name,
            fatherName,
            motherName,
            grandfatherName,
            temporaryAddress,
            permanenetAddress,
            contactNumber,
            dob,
            _kycStatus,
            _d,
            _n
        );
        requestKYC(_custaddress);
        emit customerAdded(_custaddress, _kycStatus);
        return true;
    }

    //View User KYC by Authorized Orgs
    function viewKYC(
        address _custaddress
    )
        public
        view
        returns (
            string memory name,
            string memory fatherName,
            string memory motherName,
            string memory grandfatherName,
            string memory temporaryAddress,
            string memory permanenetAddress,
            string memory contactNumber,
            string memory dob,
            bool _kycStatus,
            uint256 _d,
            uint256 _n
        )
    {
        require(
            findOrg(_custaddress, msg.sender),
            "User hasnt given their consent"
        );
        Customer memory cus = customers[_custaddress];
        // return (
        //     customers[_custaddress].name,customers[_custaddress].fatherName,
        //     customers[_custaddress].motherName,
        //     customers[_custaddress].grandfatherName,
        //     customers[_custaddress].temporaryAddress,
        //     customers[_custaddress].permanenetAddress,
        //     customers[_custaddress].contactNumber,
        //     customers[_custaddress].dob,
        //     customers[_custaddress].kycStatus,
        //     customers[_custaddress].d,
        //     customers[_custaddress].n,
        // );
        return (
            cus.name,
            cus.fatherName,
            cus.motherName,
            cus.grandfatherName,
            cus.temporaryAddress,
            cus.permanenetAddress,
            cus.contactNumber,
            cus.dob,
            cus.kycStatus,
            cus.d,
            cus.n
        );
    }

    function viewYourKYC() public view returns (Customer memory) {
        require(validCust(), "Customer not valid");
        return customers[msg.sender];
    }

    function viewOrgWithAccess() public view returns (Organization[] memory) {
        require(
            customers[msg.sender].custAddress == msg.sender,
            "You dont have authority"
        );
        return customers[msg.sender].organization;
    }

    function viewRequestCust() public view returns (kycRequestList[] memory) {
        require(validCust(), "Customer not valid");
        kycRequestList[] memory ret = new kycRequestList[](
            kycrequestsbycust[msg.sender].kycrequestlist.length
        );
        uint256 j = 0;
        for (
            uint256 i = 0;
            i < kycrequestsbycust[msg.sender].kycrequestlist.length;
            i++
        ) {
            ret[j] = kycrequestsbycust[msg.sender].kycrequestlist[i];
            j++;
        }
        return (ret);
    }

    //Update User KYC by registered and authorized orgs
    function updateKYC(
        address _custaddress,
        string memory name,
        string memory fatherName,
        string memory motherName,
        string memory grandfatherName,
        string memory temporaryAddress,
        string memory permanenetAddress,
        string memory contactNumber,
        string memory dob,
        bool _kycStatus,
        uint256 _d,
        uint256 _n
    ) public isOrgValid returns (bool) {
        require(
            customers[_custaddress].custAddress == _custaddress,
            "User doesn't exist"
        );
        require(
            findOrg(_custaddress, msg.sender),
            "You dont have access to this user"
        );
        writeKYC(
            _custaddress,
            name,
            fatherName,
            motherName,
            grandfatherName,
            temporaryAddress,
            permanenetAddress,
            contactNumber,
            dob,
            _kycStatus,
            _d,
            _n
        );
        emit customerUpdated(_custaddress, _kycStatus);
        return true;
    }

    //Request User KYC by Orgs
    function requestKYC(address _custaddress) public isOrgValid returns (bool) {
        require(
            customers[_custaddress].custAddress == _custaddress,
            "Customer doesnt exists"
        );
        require(
            findOrg(_custaddress, msg.sender) == false,
            "Already have access"
        );
        require(findRequest(_custaddress) == false, "Request Already Exists");
        kycrequestsbyorg[msg.sender].kycrequestlist.push(
            kycRequestList(kycrequestsbyorg[msg.sender].req_count, _custaddress)
        );
        kycrequestsbycust[_custaddress].kycrequestlist.push(
            kycRequestList(kycrequestsbyorg[msg.sender].req_count, msg.sender)
        );
        kycrequestsbyorg[msg.sender].req_count++;

        return true;
    }

    function deleteRequest(
        uint256 _reqcount,
        address _custaddress,
        address _ethAddress
    ) internal {
        uint256 index = findRequestIndex(_custaddress, _ethAddress);
        kycrequestsbyorg[_ethAddress].kycrequestlist[
            _reqcount
        ] = kycrequestsbyorg[_ethAddress].kycrequestlist[
            kycrequestsbyorg[_ethAddress].kycrequestlist.length - 1
        ];
        kycrequestsbyorg[_ethAddress].kycrequestlist.pop();
        kycrequestsbycust[_custaddress].kycrequestlist[
            index
        ] = kycrequestsbycust[_custaddress].kycrequestlist[
            kycrequestsbycust[_custaddress].kycrequestlist.length - 1
        ];
        kycrequestsbycust[_custaddress].kycrequestlist.pop();
        if (
            kycrequestsbyorg[msg.sender].kycrequestlist.length != _reqcount &&
            kycrequestsbyorg[_ethAddress].req_count > 1
        ) {
            kycrequestsbyorg[_ethAddress]
                .kycrequestlist[_reqcount]
                .req_count = _reqcount;
            address add = kycrequestsbyorg[_ethAddress]
                .kycrequestlist[_reqcount]
                .Address;
            if (kycrequestsbycust[add].kycrequestlist.length > 0) {
                index = findRequestIndex(add, _ethAddress);
                kycrequestsbycust[add]
                    .kycrequestlist[index]
                    .req_count = _reqcount;
            }
        }
        kycrequestsbyorg[_ethAddress].req_count--;
        emit requestRemoved(_reqcount, _ethAddress);
    }

    //Delete User KYC request by organization
    function deleteRequestOrg(
        uint256 _reqcount
    ) public isOrgValid returns (bool) {
        require(
            kycrequestsbyorg[msg.sender].ethAddress == msg.sender,
            "You dont have authority to delete"
        );
        require(
            kycrequestsbyorg[msg.sender].kycrequestlist[_reqcount].req_count ==
                _reqcount,
            "Request doesnt exist"
        );
        address _custaddress = kycrequestsbyorg[msg.sender]
            .kycrequestlist[_reqcount]
            .Address;
        deleteRequest(_reqcount, _custaddress, msg.sender);
        return true;
    }

    //Delete User KYC Request after user provides access
    function deleteRequestCust(uint256 _reqcount, address _ethAddress) public {
        require(
            organizations[_ethAddress].ethAddress == _ethAddress,
            "This particular organizations doesnt exist"
        );
        require(
            kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].Address ==
                msg.sender,
            "User not valid"
        );
        require(
            kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].req_count ==
                _reqcount,
            "Request doesnt exist"
        );
        deleteRequest(_reqcount, msg.sender, _ethAddress);
    }

    //Return Array of all pending request of the orgs
    function listRequest()
        public
        view
        isOrgValid
        returns (kycRequestList[] memory)
    {
        kycRequestList[] memory ret = new kycRequestList[](
            kycrequestsbyorg[msg.sender].req_count
        );
        uint256 j = 0;
        for (uint256 i = 0; i < kycrequestsbyorg[msg.sender].req_count; i++) {
            ret[j] = kycrequestsbyorg[msg.sender].kycrequestlist[i];
            j++;
        }
        return (ret);
    }

    //Give User KYC access to Org
    function giveAccessKYC(
        uint256 _reqcount,
        address _ethAddress,
        bool _isAllowed
    ) public returns (bool) {
        require(
            customers[msg.sender].custAddress == msg.sender,
            "You dont have authority to give access"
        );
        require(
            kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].Address ==
                msg.sender,
            "User not valid"
        );
        require(
            kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].req_count ==
                _reqcount,
            "Requests not found"
        );
        if (_isAllowed == true) {
            if (findOrg(msg.sender, _ethAddress) == false) {
                customers[msg.sender].organization.push(
                    organizations[_ethAddress]
                );
            }
            deleteRequestCust(_reqcount, _ethAddress);
            // emit accessGiven(_reqcount, msg.sender, _ethAddress, _isAllowed);
        } else {
            deleteRequestCust(_reqcount, _ethAddress);
        }
        return true;
    }

    function remove(address _custaddress, address _ethAddress) internal {
        uint256 i = findOrgIndex(_custaddress, _ethAddress);
        customers[_custaddress].organization[i] = customers[_custaddress]
            .organization[customers[_custaddress].organization.length - 1];
        customers[_custaddress].organization.pop();
    }

    //Revoke User KYC access of Orgs
    function revokeAccessKYC(address _ethAddress) public returns (bool) {
        require(
            customers[msg.sender].custAddress == msg.sender,
            "You dont have authority to revoke access"
        );
        require(
            findOrg(msg.sender, _ethAddress),
            "You dont have access to this user"
        );
        remove(msg.sender, _ethAddress);
        //emit accessRevoked(msg.sender, _ethAddress);
        return true;
    }

    //Remove User KYC by Orgs
    function removeKYC(address _custaddress) public isOrgValid returns (bool) {
        require(
            customers[_custaddress].custAddress == _custaddress,
            "User doesn't exist"
        );
        require(
            findOrg(_custaddress, msg.sender),
            "You dont have access to this user"
        );
        remove(_custaddress, msg.sender);
        // emit kycRemoved(_custaddress, msg.sender);
        return true;
    }
}
