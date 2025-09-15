import CyberDevs from './../assets/CyberDevs.png';
import ComputerStudies from './../assets/computerstudies.png';
import StudentCouncil from './../assets/csc.png';

const Header: React.FC = () => (
    <div className="w-full flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 px-4 py-4 mb-1 sm:mb-2 lg:mb-4">
        {/* Computer Studies Logo */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 flex items-center justify-center flex-shrink-0">
            <img
                src={ComputerStudies}
                alt="Computer Studies Logo"
                className="w-full h-full object-contain rounded-full"
                 style={{ transform: 'translateY(30px)' }}
            />
        </div>
        
        {/* CyberDevs Logo */}
        <div className="w-22 h-22 sm:w-24 sm:h-24 lg:w-30 lg:h-30 xl:w-40 xl:h-40 flex items-center justify-center flex-shrink-0">
            <img
                src={CyberDevs}
                alt="CyberDevs Logo"
                className="w-full h-full object-contain rounded-full"
            />
        </div>

        {/* Student Council Logo */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 flex items-center justify-center flex-shrink-0">
            <img
                src={StudentCouncil}
                alt="Student Council Logo"
                className="w-full h-full object-contain rounded-full"
                 style={{ transform: 'translateY(30px)' }}
            />
        </div>
    </div>
);

export default Header;