import CyberDevs from './../assets/CyberDevs.png';
import ComputerStudies from './../assets/computerstudies.png';
import StudentCouncil from './../assets/csc.png';

const Header: React.FC = () => (
    
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-8"
            style={{ transform: 'translateY(-30px)' }}
            >
            {/* Computer Studies Logo */}
            <div className="w-35 h-30 flex items-center justify-center">
                <img
                src={ComputerStudies}
                alt="Computer Studies Logo"
                className="w-30 h-30 object-contain rounded-full"
                style={{ transform: 'translateY(30px)' }}
                />
            </div>
            
            {/* CyberDevs Logo */}
            <div className="w-45 h-40 flex items-center justify-center">
                <img
                src={CyberDevs}
                alt="CyberDevs Logo"
                className="w-40 h-40 object-contain"
                />
            </div>

            {/* Student Council Logo */}
            <div className="w-35 h-30 flex items-center justify-center">
                <img
                src={StudentCouncil}
                alt="Student Council Logo"
                className="w-29 h-29 object-contain rounded-full"
                style={{ transform: 'translateY(30px)' }}
                />
            </div>
        </div>
);

export default Header;
