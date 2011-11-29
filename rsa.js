'use strict';

// Data file of the factored RSA numbers.  Format is:
//
//   RSA-id: [ factor1, factor2, semiprime ]
//
// Taken from http://en.wikipedia.org/wiki/RSA_numbers .

var rsa = {
  100: [
    '37975227936943673922808872755445627854565536638199',
    '40094690950920881030683735292761468389214899724061',
    '1522605027922533360535618378132637429718068114961380688657908494580122963258952897654000350692006139'
  ],

  110: [
    '6122421090493547576937037317561418841225758554253106999',
    '5846418214406154678836553182979162384198610505601062333',
    '35794234179725868774991807832568455403003778024228226193532908190484670252364677411513516111204504060317568667'
  ],
  120: [
    '327414555693498015751146303749141488063642403240171463406883',
    '693342667110830181197325401899700641361965863127336680673013',
    '227010481295437363334259960947493668895875336466084780038173258247009162675779735389791151574049166747880487470296548479'
  ],
  129: [
    '3490529510847650949147849619903898133417764638493387843990820577',
    '32769132993266709549961988190834461413177642967992942539798288533',
    '114381625757888867669235779976146612010218296721242362562561842935706935245733897830597123563958705058989075147599290026879543541'
  ],
  130: [
    '39685999459597454290161126162883786067576449112810064832555157243',
    '45534498646735972188403686897274408864356301263205069600999044599',
    '1807082088687404805951656164405905566278102516769401349170127021450056662540244048387341127590812303371781887966563182013214880557'
  ],
  140: [
    '3398717423028438554530123627613875835633986495969597423490929302771479',
    '6264200187401285096151654948264442219302037178623509019111660653946049',
    '21290246318258757547497882016271517497806703963277216278233383215381949984056495911366573853021918316783107387995317230889569230873441936471'
  ],
  150: [
    '348009867102283695483970451047593424831012817350385456889559637548278410717',
    '445647744903640741533241125787086176005442536297766153493419724532460296199',
    '155089812478348440509606754370011861770654545830995430655466945774312632703463465954363335027577729025391453996787414027003501631772186840890795964683'
  ],
  155: [
    '102639592829741105772054196573991675900716567808038066803341933521790711307779',
    '106603488380168454820927220360012878679207958575989291522270608237193062808643',
    '10941738641570527421809707322040357612003732945449205990913842131476349984288934784717997257891267332497625752899781833797076537244027146743531593354333897'
  ],
  160: [
    '45427892858481394071686190649738831656137145778469793250959984709250004157335359',
    '47388090603832016196633832303788951973268922921040957944741354648812028493909367',
    '2152741102718889701896015201312825429257773588845675980170497676778133145218859135673011059773491059602497907111585214302079314665202840140619946994927570407753'
  ],
  170: [
    '3586420730428501486799804587268520423291459681059978161140231860633948450858040593963',
    '7267029064107019078863797763923946264136137803856996670313708936002281582249587494493',
    '26062623684139844921529879266674432197085925380486406416164785191859999628542069361450283931914514618683512198164805919882053057222974116478065095809832377336510711545759'
  ],
  576: [
    '398075086424064937397125500550386491199064362342526708406385189575946388957261768583317',
    '472772146107435302536223071973048224632914695302097116459852171130520711256363590397527',
    '188198812920607963838697239461650439807163563379417382700763356422988859715234665485319060606504743045317388011303396716199692321205734031879550656996221305168759307650257059'
  ],
  180: [
    '400780082329750877952581339104100572526829317815807176564882178998497572771950624613470377',
    '476939688738611836995535477357070857939902076027788232031989775824606225595773435668861833',
    '191147927718986609689229466631454649812986246276667354864188503638807260703436799058776201365135161278134258296128109200046702912984568752800330221777752773957404540495707851421041'
  ],
  190: [
    '31711952576901527094851712897404759298051473160294503277847619278327936427981256542415724309619',
    '60152600204445616415876416855266761832435433594718110725997638280836157040460481625355619404899',
    '1907556405060696491061450432646028861081179759533184460647975622318915025587184175754054976155121593293492260464152630093238509246603207417124726121580858185985938946945490481721756401423481'
  ],
  200: [
    '3532461934402770121272604978198464368671197400197625023649303468776121253679423200058547956528088349',
    '7925869954478333033347085841480059687737975857364219960734330341455767872818152135381409304740185467',
    '27997833911221327870829467638722601621070446786955428537560009929326128400107609345671052955360856061822351910951365788637105954482006576775098580557613579098734950144178863178946295187237869221823983'
  ],
  640: [
    '1634733645809253848443133883865090859841783670033092312181110852389333100104508151212118167511579',
    '1900871281664822113126851573935413975471896789968515493666638539088027103802104498957191261465571',
    '3107418240490043721350750035888567930037346022842727545720161948823206440518081504556346829671723286782437916272838033415471073108501919548529007337724822783525742386454014691736602477652346609'
  ],
  768: [
    '33478071698956898786044169848212690817704794983713768568912431388982883793878002287614711652531743087737814467999489',
    '36746043666799590428244633799627952632279158164343087642676032283815739666511279233373417143396810270092798736308917',
    '1230186684530117755130494958384962720772853569595334792197322452151726400507263657518745202199786469389956474942774063845925192557326303453731548268507917026122142913461670429214311602221240479274737794080665351419597459856902143413'
  ]
};
