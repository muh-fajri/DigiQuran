/* Scroll to Top */
btnTop = document.getElementById("toTop");
window.onscroll = function() {
    scroll()
};
const scroll = () => {
    if(document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
        btnTop.style.display = "block";
    } else {
        btnTop.style.display = "none";
    }
}
const gotoTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
/*-- Scroll to Top --*/

/* Button Open and Close Search */
const openSearch = () => {
    document.getElementsByClassName("search-menu")[0].style.display = "flex";
}
const closeSearch = () => {
    document.getElementsByClassName("search-menu")[0].style.display = "none";
}
/*-- Button Open and Close Search --*/

/* Metode Parsing JSON dengan HTTP Request */
// const xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = function() {
//     if(this.readyState == 4 && this.status == 200) {
//         // Typical action to be performed when the document is ready:
//         const data = JSON.parse(xhttp.responseText);
//         data.forEach((element) => {
//             document.getElementById("article").innerHTML +=
//             `
//                 <div class="card">
//                     <h2 class="surah-name">${element.nama}</h2>
//                     <h3 class="latin-name">${element.nama_latin} (${element.nomor})</h3>
//                     <p class="surah-attribute">
//                         <span class="ayah-count">${element.jumlah_ayat} ayat</span>
//                     </p>
//                     <p class="surah-translation">${element.arti}</p>
//                 </div>
//             `;
//         });
//         console.log(data);
//     }
// };
// // xhttp.open("GET", "./data.json", true);
// xhttp.open("GET", "res_DaftarSurah.json", true);
// xhttp.send();
/*-- Metode Parsing JSON dengan HTTP Request --*/

/* Metode Parsing JSON dengan AJAX-nya jQuery */
// $.getJSON('./res_DaftarSurah.json', (data) => {
$.getJSON('https://equran.id/api/surat', (data) => {
    console.log(data);
    $.each(data, (i, data) => {
        // console.log(i);
        // console.log(data);
        $('#surah-list').append(`
            <div class="card">
                <h2 class="surah-name" data-target="#content-surah" data-id="${data.nomor}">${data.nama}</h2>
                <h3 class="latin-name">${data.nama_latin} (${data.nomor})</h3>
                <p class="surah-attribute"><span class="ayah-count">${data.jumlah_ayat} ayat</span></p>
                <p class="surah-translation">${data.arti}</p>
                <audio controls>
                <source src="${data.audio}" type="audio/mpeg">
                </audio>
            </div>
        `);
    })
});

$('#surah-list').on('click', '.surah-name', function() {
    $('#surah-list').html('');
    // console.log($(this).data("id"));
    let nomor = $(this).data("id");
    console.log(nomor);
    // console.log($('.surah-name').data('id'));

    // $.getJSON('./res_SurahFatihah.json', (data) => {
    $.getJSON(`https://equran.id/api/surat/${nomor}`, (data) => {
        console.log(data);
        $('#surah-content').append(`
            <div class="back-bar">
                <p><a href="./index.html"><span class="fas fa-angle-left"></span> Kembali</a></p>
            </div>
            <div class="title" style="text-align:center">
                <h2>${data.nama}</h2>
                <p>
                    <span>${data.nama_latin}</span>
                    <span>(${data.arti})</span>
                </p>
                <p style="font-size:14px;font-weight:bold">
                    <span>Surah ke-${data.nomor}</span>
                    :
                    <span>${data.jumlah_ayat} ayat</span>
                </p>
            </div>
        `);
        let ayat = data.ayat;
    // console.log(ayat);
    $.each(ayat, (i, data) => {
        // console.log(i);
        console.log(data);
        $('#surah-content').append(`
            <div class="detail">
                <p class="nomor">${data.surah}:${data.nomor}</p>
                <p class="arab" dir="rtl">${data.ar}</p>
                <p class="trs">${data.tr}</p>
                <p class="idn">${data.idn}</p>
            </div>
        `);
    })
});
});

// $.getJSON('./res_SurahFatihah.json', (data) => {
//     let fatihah = data.ayat;
//     // console.log(fatihah);
//     $.each(fatihah, (i, data) => {
//         // console.log(i);
//         // console.log(data);
//         $('#article').append('<div class="card"><h2 class="surah-name">'+data.nomor+'</h2><h3 class="latin-name">'+data.ar+'</h3><p class="surah-attribute"><span class="ayah-count">'+data.tr+'</span></p><p class="surah-translation">'+data.idn+'</p></div>');
//     })
// });
/*-- Metode Parsing JSON dengan AJAX-nya jQuery --*/